r"""
   \==================================================================
   \==   @ Henvo                                                    ==
   \==   @ author: Mai Quoc Viet                                    ==
   \==   @ project: knowledge                                       ==
   \==   @ copyright: (c) 2026 Henvo. All rights reserved.          ==
   \==================================================================
"""

import unicodedata
from django.db.models import CharField, Func


class VnNorm(Func):
    """
    Wraps the Postgres immutable_vn_norm(text) function: lowercases, strips
    Latin diacritics, and maps đ -> d. Backed by GIN trigram indexes on
    e.g. accounts.name, so it can be used in ILIKE
    /icontains filters and still hit an index.
    """
    function = "immutable_vn_norm"
    output_field = CharField()


def strip_vn_accents(text: str) -> str:
    """
    Python-side mirror of the immutable_vn_norm SQL function: lowercases,
    decomposes Unicode (NFD), drops combining marks (diacritics), and
    maps đ -> d. Apply this to the query string so both sides of the
    comparison are normalized identically.
    """
    text = text.lower()
    text = "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")
    return text.replace("đ", "d")


def duration_text(seconds) -> str:
    """
    A length of time the way people say it: 90 becomes "1 phút 30 giây".

    For names shown in the admin, where "90s" reads as code and a bare 570
    has to be divided by sixty in the reader's head.
    """
    seconds = max(int(seconds or 0), 0)
    hours, rest = divmod(seconds, 3600)
    minutes, secs = divmod(rest, 60)
    parts = [f"{value} {unit}" for value, unit in ((hours, "giờ"), (minutes, "phút"), (secs, "giây")) if value]
    return " ".join(parts) or "0 giây"


def group_digits(value) -> str:
    """
    Format an integer the Vietnamese way: 450000 becomes "450.000".

    Vietnamese groups thousands with a full stop, the opposite of the comma
    Python's format spec produces, so the swap happens here rather than in
    every caller. Not routed through Django's number_format: that one follows
    USE_THOUSAND_SEPARATOR and the active locale, and these strings are read
    on admin pages whose locale is switched per request by middleware.

    A price is the single most misread number on a review page — 450000 and
    4500000 differ by one glyph nobody counts.
    """
    try:
        return f"{int(value):,}".replace(",", ".")
    except (TypeError, ValueError):
        return str(value)
