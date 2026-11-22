from datetime import timedelta
from uuid import UUID

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connection
from django.utils import timezone

from bookings.models import BookingRequest


class Command(BaseCommand):
    help = "Create or refresh sample table requests for local admin preview."

    SAMPLES = [
        {
            "request_id": UUID("bc3d12d0-99e4-4a20-9c52-000000000001"),
            "name": "Alex Morgan", "email": "alex.morgan@example.com", "phone": "0400 123 456",
            "day_offset": 1, "time": "10:30", "guests": 2,
            "notes": "Window seat if available.", "status": BookingRequest.Status.NEW,
            "notification_status": BookingRequest.NotificationStatus.SENT,
        },
        {
            "request_id": UUID("bc3d12d0-99e4-4a20-9c52-000000000002"),
            "name": "Taylor Nguyen", "email": "taylor.nguyen@example.com", "phone": "0412 345 678",
            "day_offset": 2, "time": "12:00", "guests": 5,
            "notes": "High chair, please.", "status": BookingRequest.Status.NEW,
            "notification_status": BookingRequest.NotificationStatus.FAILED,
        },
        {
            "request_id": UUID("bc3d12d0-99e4-4a20-9c52-000000000003"),
            "name": "Jordan Lee", "email": "jordan.lee@example.com", "phone": "0433 222 110",
            "day_offset": 3, "time": "09:15", "guests": 3,
            "notes": "One guest is vegetarian.", "status": BookingRequest.Status.CONFIRMED,
            "notification_status": BookingRequest.NotificationStatus.SENT,
        },
        {
            "request_id": UUID("bc3d12d0-99e4-4a20-9c52-000000000004"),
            "name": "Casey Wilson", "email": "casey.wilson@example.com", "phone": "0408 555 012",
            "day_offset": 0, "time": "13:00", "guests": 2,
            "notes": "Birthday lunch.", "status": BookingRequest.Status.CONTACTED,
            "notification_status": BookingRequest.NotificationStatus.PENDING,
        },
        {
            "request_id": UUID("bc3d12d0-99e4-4a20-9c52-000000000005"),
            "name": "Morgan Patel", "email": "morgan.patel@example.com", "phone": "0421 987 654",
            "day_offset": -2, "time": "11:45", "guests": 4,
            "notes": "No special requests.", "status": BookingRequest.Status.CANCELLED,
            "notification_status": BookingRequest.NotificationStatus.SENT,
        },
        {
            "request_id": UUID("bc3d12d0-99e4-4a20-9c52-000000000006"),
            "name": "Riley Chen", "email": "riley.chen@example.com", "phone": "0402 777 909",
            "day_offset": 5, "time": "14:00", "guests": 8,
            "notes": "A table together for a small group.", "status": BookingRequest.Status.CONFIRMED,
            "notification_status": BookingRequest.NotificationStatus.SENT,
        },
    ]

    def handle(self, *args, **options):
        if not settings.DEBUG or connection.vendor != "sqlite":
            raise CommandError("seed_data is restricted to DEBUG + local SQLite; it will not write to production databases.")

        today = timezone.localdate()
        created_count = 0
        updated_count = 0
        for sample in self.SAMPLES:
            values = sample.copy()
            day_offset = values.pop("day_offset")
            values["date"] = today + timedelta(days=day_offset)
            booking, created = BookingRequest.objects.update_or_create(
                request_id=values.pop("request_id"), defaults=values
            )
            created_count += int(created)
            updated_count += int(not created)

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(self.SAMPLES)} sample bookings ({created_count} created, {updated_count} refreshed). No emails were sent."
        ))
