from django.utils.functional import lazy
from django.utils.translation import get_language


def _pick(en, vi):
    return vi if (get_language() or "en").startswith("vi") else en


def label(en, vi):
    """A string shown in English or Vietnamese, following the admin's language switch."""
    return lazy(_pick, str)(en, vi)
