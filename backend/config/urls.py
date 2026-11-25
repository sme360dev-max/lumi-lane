from django.contrib import admin
from django.urls import path
from django.views.generic import RedirectView

from bookings.views import booking_create, health
from menu.views import menu_list
from loyalty.views import register, wallet_pass

admin.site.site_header = "Lumi Lane"
admin.site.site_title = "Lumi Lane Admin"
admin.site.index_title = "Operations"
admin.site.index_template = "admin/index.html"

urlpatterns = [
    path("", RedirectView.as_view(url="/admin/", permanent=False), name="home"),
    path("admin/", admin.site.urls),
    path("health/", health, name="health"),
    path("api/bookings/", booking_create, name="booking-create"),
    path("api/menu/", menu_list, name="menu-list"),
    path("api/loyalty/register/", register, name="loyalty-register"),
    path("api/loyalty/wallet/", wallet_pass, name="loyalty-wallet"),
]
