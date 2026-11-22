import uuid

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="BookingRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("request_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("name", models.CharField(max_length=120, verbose_name="Tên khách")),
                ("email", models.EmailField(max_length=254, verbose_name="Email")),
                ("phone", models.CharField(max_length=40, verbose_name="Điện thoại")),
                ("guests", models.PositiveSmallIntegerField(verbose_name="Số khách")),
                ("date", models.DateField(verbose_name="Ngày đặt")),
                ("time", models.TimeField(verbose_name="Giờ đến")),
                ("notes", models.TextField(blank=True, verbose_name="Yêu cầu đặc biệt")),
                ("status", models.CharField(choices=[("new", "Mới"), ("contacted", "Đã liên hệ"), ("confirmed", "Đã xác nhận"), ("cancelled", "Đã hủy")], db_index=True, default="new", max_length=16, verbose_name="Trạng thái")),
                ("notification_status", models.CharField(choices=[("pending", "Đang chờ"), ("sent", "Đã gửi email"), ("failed", "Gửi email lỗi")], default="pending", max_length=12, verbose_name="Email thông báo")),
                ("submitted_at", models.DateTimeField(auto_now_add=True, db_index=True, verbose_name="Thời gian gửi")),
            ],
            options={"verbose_name": "Yêu cầu đặt bàn", "verbose_name_plural": "Yêu cầu đặt bàn", "ordering": ("-submitted_at",)},
        ),
    ]
