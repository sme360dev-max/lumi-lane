r"""
   \==================================================================
   \==   @ Henvo                                                    ==
   \==   @ author: Mai Quoc Viet                                    ==
   \==   @ project: knowledge                                       ==
   \==   @ copyright: (c) 2026 Henvo. All rights reserved.          ==
   \==================================================================
"""

from django import template
from django.utils import timezone
from django.utils.html import format_html
from django.templatetags.static import static

from admin_ui.nav import build_nav
from admin_ui.vn_text import group_digits

register = template.Library()

ICON_SPRITE = "admin_ui/img/admin-icons.svg"

WEEKDAYS = ("Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ nhật")


@register.simple_tag(takes_context=True)
def admin_nav(context):
    """The sidebar sections for the signed-in staff member, or none."""
    request = context.get("request")
    if request is None or not getattr(request.user, "is_staff", False):
        return []
    return build_nav(request)


@register.simple_tag
def icon(name, extra=""):
    """
    One glyph from the admin's own icon sprite.

    A sprite rather than an icon font: every glyph is drawn in the same 24-unit
    grid with the same stroke, takes its colour from the text around it, and
    nothing is fetched from a third party.
    """
    classes = f"hv-i {extra}".strip()
    return format_html(
        '<svg class="{}" aria-hidden="true" focusable="false"><use href="{}#{}"></use></svg>',
        classes,
        static(ICON_SPRITE),
        name,
    )


@register.filter
def initials(user):
    """Two letters for the avatar circle: first and last name, else the username."""
    first = (getattr(user, "first_name", "") or "").strip()
    last = (getattr(user, "last_name", "") or "").strip()
    if first or last:
        letters = (last[:1] + first[:1]) if last and first else (first or last)[:2]
    else:
        letters = (getattr(user, "username", "") or "?")[:2]
    return letters.upper()


@register.filter
def digits(value):
    """450000 as 450.000, for numbers set in running text."""
    return group_digits(value)


@register.simple_tag(takes_context=True)
def today_label(context):
    """Today in the selected admin language."""
    today = timezone.localdate()
    language = getattr(context.get("request"), "LANGUAGE_CODE", "en-au")
    if not language.startswith("vi"):
        return today.strftime("%A, %d %B %Y").replace(", 0", ", ")
    return f"{WEEKDAYS[today.weekday()]}, {today.day} tháng {today.month}, {today.year}"


@register.simple_tag(takes_context=True)
def greeting(context):
    """A greeting based on the venue's local time and selected language."""
    hour = timezone.localtime().hour
    language = getattr(context.get("request"), "LANGUAGE_CODE", "en-au")
    if not language.startswith("vi"):
        if hour < 12:
            return "Good morning"
        if hour < 17:
            return "Good afternoon"
        return "Good evening"
    if hour < 11:
        return "Chào buổi sáng"
    if hour < 14:
        return "Chào buổi trưa"
    if hour < 18:
        return "Chào buổi chiều"
    return "Chào buổi tối"


@register.simple_tag
def booking_dashboard_counts():
    """A few useful totals without rendering the full list of admin tables."""
    try:
        from bookings.models import BookingRequest

        today = timezone.localdate()
        return {
            "new": BookingRequest.objects.filter(status=BookingRequest.Status.NEW).count(),
            "today": BookingRequest.objects.filter(date=today).exclude(status=BookingRequest.Status.CANCELLED).count(),
            "email_issues": BookingRequest.objects.filter(
                notification_status=BookingRequest.NotificationStatus.FAILED
            ).count(),
        }
    except Exception:
        return {"new": 0, "today": 0, "email_issues": 0}

