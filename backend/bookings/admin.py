from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group, User
from django.db.models import Count
from django.utils.functional import lazy
from django.utils.formats import date_format, time_format
from django.utils.html import format_html
from django.utils.translation import get_language

from .models import BookingRequest
from .views import _send_booking_notification


def label(en, vi):
    return lazy(lambda: vi if (get_language() or "en").startswith("vi") else en, str)()


class ReservationStatusFilter(admin.SimpleListFilter):
    title = label("Reservation status", "Trạng thái đặt bàn")
    parameter_name = "status"

    def lookups(self, request, model_admin):
        return [(key, label(en, vi)) for key, en, vi in [
            ("new", "New", "Mới"), ("contacted", "Contacted", "Đã liên hệ"),
            ("confirmed", "Confirmed", "Đã xác nhận"), ("cancelled", "Cancelled", "Đã hủy"),
        ]]

    def queryset(self, request, queryset):
        return queryset.filter(status=self.value()) if self.value() else queryset


class NotificationStatusFilter(admin.SimpleListFilter):
    title = label("Email notification", "Thông báo email")
    parameter_name = "notification_status"

    def lookups(self, request, model_admin):
        return [(key, label(en, vi)) for key, en, vi in [
            ("pending", "Pending", "Đang chờ"), ("sent", "Sent", "Đã gửi"), ("failed", "Failed", "Gửi lỗi"),
        ]]

    def queryset(self, request, queryset):
        return queryset.filter(notification_status=self.value()) if self.value() else queryset


@admin.action(description=label("Retry failed email notifications", "Gửi lại email thông báo bị lỗi"))
def resend_failed_notifications(modeladmin, request, queryset):
    failed = queryset.filter(notification_status=BookingRequest.NotificationStatus.FAILED)
    for booking_id in failed.values_list("pk", flat=True):
        _send_booking_notification(booking_id)


@admin.register(BookingRequest)
class BookingRequestAdmin(admin.ModelAdmin):
    actions = (resend_failed_notifications,)
    list_display = ("guest_summary", "visit_summary", "party_size", "status_badge", "email_badge")
    list_display_links = ("guest_summary",)
    list_filter = (ReservationStatusFilter, NotificationStatusFilter)
    search_fields = ("name", "email", "phone")
    date_hierarchy = "date"
    ordering = ("-submitted_at",)
    list_per_page = 30
    readonly_fields = ("request_id", "submitted_at", "notification_status")

    @admin.display(description=label("Guest", "Khách hàng"), ordering="name")
    def guest_summary(self, obj):
        return format_html('<span class="hv-record-primary">{}</span><span class="hv-record-secondary">{}</span>', obj.name, obj.email)

    @admin.display(description=label("Visit", "Thời gian"), ordering="date")
    def visit_summary(self, obj):
        return format_html(
            '<span class="hv-record-primary">{}</span><span class="hv-record-secondary">{}</span>',
            date_format(obj.date, "DATE_FORMAT"), time_format(obj.time, "TIME_FORMAT"),
        )

    @admin.display(description=label("Party", "Số khách"), ordering="guests")
    def party_size(self, obj):
        guests = label("guest", "khách") if obj.guests == 1 else label("guests", "khách")
        return format_html('<span class="hv-party-size">{} <span>{}</span></span>', obj.guests, guests)

    @admin.display(description=label("Reservation", "Đặt bàn"), ordering="status")
    def status_badge(self, obj):
        labels = {
            "new": (label("New", "Mới"), "hv-chip-pending"),
            "contacted": (label("Contacted", "Đã liên hệ"), "hv-chip-approved"),
            "confirmed": (label("Confirmed", "Đã xác nhận"), "hv-chip-approved"),
            "cancelled": (label("Cancelled", "Đã hủy"), "hv-chip-rejected"),
        }
        text, style = labels[obj.status]
        return format_html('<span class="hv-chip {}">{}</span>', style, text)

    @admin.display(description=label("Notification", "Email"), ordering="notification_status")
    def email_badge(self, obj):
        labels = {
            "pending": (label("Pending", "Đang chờ"), "hv-chip-pending"),
            "sent": (label("Sent", "Đã gửi"), "hv-chip-approved"),
            "failed": (label("Failed", "Gửi lỗi"), "hv-chip-rejected"),
        }
        text, style = labels[obj.notification_status]
        return format_html('<span class="hv-chip {}">{}</span>', style, text)

    def get_fieldsets(self, request, obj=None):
        if (request.LANGUAGE_CODE or "en").startswith("vi"):
            return (
                ("Thông tin khách hàng", {"fields": ("name", "email", "phone", "guests")} ),
                ("Thời gian đặt bàn", {"fields": (("date", "time"), "status", "notes")} ),
                ("Theo dõi yêu cầu", {"fields": ("request_id", "notification_status", "submitted_at")} ),
            )
        return (
            ("Guest details", {"fields": ("name", "email", "phone", "guests")} ),
            ("Reservation", {"fields": (("date", "time"), "status", "notes")} ),
            ("Request tracking", {"fields": ("request_id", "notification_status", "submitted_at")} ),
        )

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        labels = {
            "name": ("Guest name", "Tên khách"), "email": ("Email address", "Email"),
            "phone": ("Phone number", "Số điện thoại"), "guests": ("Number of guests", "Số khách"),
            "date": ("Reservation date", "Ngày đặt bàn"), "time": ("Arrival time", "Giờ đến"),
            "notes": ("Special requests", "Yêu cầu đặc biệt"), "status": ("Reservation status", "Trạng thái đặt bàn"),
        }
        vi = (request.LANGUAGE_CODE or "en").startswith("vi")
        for field_name, choices in labels.items():
            if field_name in form.base_fields:
                form.base_fields[field_name].label = choices[1 if vi else 0]
        if "status" in form.base_fields:
            form.base_fields["status"].choices = [
                ("new", label("New", "Mới")), ("contacted", label("Contacted", "Đã liên hệ")),
                ("confirmed", label("Confirmed", "Đã xác nhận")), ("cancelled", label("Cancelled", "Đã hủy")),
            ]
        return form

    def get_queryset(self, request):
        return super().get_queryset(request)

    def changelist_view(self, request, extra_context=None):
        extra_context = {**(extra_context or {}), "title": label("Table requests", "Yêu cầu đặt bàn")}
        return super().changelist_view(request, extra_context=extra_context)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = {**(extra_context or {}), "title": label("Booking request details", "Chi tiết yêu cầu đặt bàn")}
        return super().change_view(request, object_id, form_url, extra_context=extra_context)

    def add_view(self, request, form_url="", extra_context=None):
        extra_context = {**(extra_context or {}), "title": label("Add booking request", "Thêm yêu cầu đặt bàn")}
        return super().add_view(request, form_url, extra_context=extra_context)


class LumiLaneUserAdmin(UserAdmin):
    list_display = ("username", "full_name", "email", "is_staff", "is_active", "last_login")
    list_display_links = ("username",)
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("username", "first_name", "last_name", "email")
    ordering = ("username",)

    @admin.display(description=label("Full name", "Họ và tên"), ordering="first_name")
    def full_name(self, obj):
        return obj.get_full_name() or "—"


class LumiLaneGroupAdmin(GroupAdmin):
    list_display = ("name", "permission_count")
    search_fields = ("name",)
    filter_horizontal = ("permissions",)

    @admin.display(description=label("Permissions", "Quyền hạn"))
    def permission_count(self, obj):
        count = obj._permission_count
        return label(f"{count} permissions", f"{count} quyền")

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_permission_count=Count("permissions"))


admin.site.unregister(User)
admin.site.unregister(Group)
admin.site.register(User, LumiLaneUserAdmin)
admin.site.register(Group, LumiLaneGroupAdmin)
