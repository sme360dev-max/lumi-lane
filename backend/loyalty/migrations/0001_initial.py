from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="ClubMember",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("registration_id", models.UUIDField(editable=False, unique=True)),
                ("code", models.CharField(editable=False, max_length=12, unique=True)),
                ("name", models.CharField(max_length=100)),
                ("joined_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
