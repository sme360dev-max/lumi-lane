from django.db import models


class ClubMember(models.Model):
    registration_id = models.UUIDField(unique=True, editable=False)
    code = models.CharField(max_length=12, unique=True, editable=False)
    name = models.CharField(max_length=100)
    joined_at = models.DateTimeField(auto_now_add=True)
