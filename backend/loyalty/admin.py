from django.contrib import admin

from .models import ClubMember


@admin.register(ClubMember)
class ClubMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "joined_at")
    search_fields = ("name", "code")
    readonly_fields = ("code", "joined_at")

    def has_add_permission(self, request):
        return False
