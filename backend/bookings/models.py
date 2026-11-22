import uuid

from django.db import models


class BookingRequest(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Mới"
        CONTACTED = "contacted", "Đã liên hệ"
        CONFIRMED = "confirmed", "Đã xác nhận"
        CANCELLED = "cancelled", "Đã hủy"

    class NotificationStatus(models.TextChoices):
        PENDING = "pending", "Đang chờ"
        SENT = "sent", "Đã gửi email"
        FAILED = "failed", "Gửi email lỗi"

    request_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField("Tên khách", max_length=120)
    email = models.EmailField("Email", max_length=254)
    phone = models.CharField("Điện thoại", max_length=40)
    guests = models.PositiveSmallIntegerField("Số khách")
    date = models.DateField("Ngày đặt")
    time = models.TimeField("Giờ đến")
    notes = models.TextField("Yêu cầu đặc biệt", blank=True)
    status = models.CharField("Trạng thái", max_length=16, choices=Status.choices, default=Status.NEW, db_index=True)
    notification_status = models.CharField(
        "Email thông báo", max_length=12, choices=NotificationStatus.choices, default=NotificationStatus.PENDING
    )
    submitted_at = models.DateTimeField("Thời gian gửi", auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-submitted_at",)
        verbose_name = "Yêu cầu đặt bàn"
        verbose_name_plural = "Yêu cầu đặt bàn"

    def __str__(self):
        return f"{self.name} · {self.date:%d/%m/%Y} {self.time:%H:%M} ({self.guests} khách)"
