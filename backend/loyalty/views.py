import json
import logging
from secrets import randbelow
from uuid import UUID

from cryptography.exceptions import InvalidSignature, UnsupportedAlgorithm
from django.conf import settings
from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import ClubMember
from .wallet import build_pass, wallet_signer

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def register(request):
    if request.method == "OPTIONS":
        return JsonResponse({}, status=204)
    if request.content_type != "application/json" or len(request.body) > 2048:
        return JsonResponse({"error": "Invalid registration request."}, status=400)
    try:
        payload = json.loads(request.body)
        registration_id = UUID(payload["registrationId"])
        name = payload["name"].strip()
    except (ValueError, TypeError, KeyError, AttributeError):
        return JsonResponse({"error": "Enter your name and try again."}, status=400)
    if registration_id.version != 4 or not 1 <= len(name) <= 100:
        return JsonResponse({"error": "Enter a name of up to 100 characters."}, status=400)

    for _ in range(5):
        try:
            member, created = ClubMember.objects.get_or_create(
                registration_id=registration_id,
                defaults={"name": name, "code": f"89{randbelow(10**10):010d}"},
            )
        except IntegrityError:
            continue
        return JsonResponse({"code": member.code}, status=201 if created else 200)

    return JsonResponse({"error": "Could not issue a card. Please try again."}, status=503)


@csrf_exempt
@never_cache
@require_http_methods(["GET", "POST"])
def wallet_pass(request):
    if request.method == "POST" and request.headers.get("Origin") not in settings.CORS_ALLOWED_ORIGINS:
        return JsonResponse({"error": "Open Coffee Club to add your card."}, status=403)
    try:
        signer = wallet_signer()
    except (OSError, ValueError, KeyError, IndexError, InvalidSignature, UnsupportedAlgorithm):
        logger.exception("Coffee Club Wallet signing configuration is invalid")
        signer = None
    if request.method == "GET":
        return JsonResponse({"available": signer is not None})
    if signer is None:
        return JsonResponse({"error": "Apple Wallet is temporarily unavailable."}, status=503)
    try:
        registration_id = UUID(request.POST.get("registrationId", ""))
    except ValueError:
        return JsonResponse({"error": "Open your member card and try again."}, status=400)
    member = ClubMember.objects.filter(registration_id=registration_id).first()
    if member is None:
        return JsonResponse({"error": "Member card not found."}, status=404)
    response = HttpResponse(build_pass(member, signer), content_type="application/vnd.apple.pkpass")
    response["Content-Disposition"] = 'attachment; filename="lumi-lane-coffee-club.pkpass"'
    return response
