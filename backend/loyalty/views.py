import json
from secrets import randbelow
from uuid import UUID

from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import ClubMember


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
