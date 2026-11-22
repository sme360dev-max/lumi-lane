from django.conf import settings
from django.http import HttpResponse
from django.middleware.locale import LocaleMiddleware
from django.utils import translation


class DefaultEnglishLocaleMiddleware(LocaleMiddleware):
    """Use the explicit language cookie, otherwise always default to English."""

    def process_request(self, request):
        language = request.COOKIES.get(settings.LANGUAGE_COOKIE_NAME, settings.LANGUAGE_CODE)
        try:
            language = translation.get_supported_language_variant(language)
        except LookupError:
            language = settings.LANGUAGE_CODE
        translation.activate(language)
        request.LANGUAGE_CODE = language


class CorsMiddleware:
    """Allow browser API calls only from the configured website origins."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get("Origin")
        allowed = origin in settings.CORS_ALLOWED_ORIGINS
        if request.method == "OPTIONS" and request.path.startswith("/api/"):
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)
        if allowed:
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type"
            response["Access-Control-Max-Age"] = "600"
            response["Vary"] = "Origin"
        return response
