r"""
   \==================================================================
   \==   @ Henvo                                                    ==
   \==   @ author: Mai Quoc Viet                                    ==
   \==   @ project: knowledge                                       ==
   \==   @ copyright: (c) 2026 Henvo. All rights reserved.          ==
   \==================================================================
"""

from types import SimpleNamespace

from django.contrib.auth.models import User
from django.test import RequestFactory, SimpleTestCase, TestCase

from admin_ui import charts, nav, vn_text
from admin_ui.templatetags import admin_ui as tags


class ChartTests(SimpleTestCase):
    """admin_ui/charts.py."""

    def test_css_pct_never_uses_comma(self):
        """Locale vi would print 12,5 and the browser drops the rule."""
        self.assertNotIn(",", charts.css_pct(12.5))

    def test_nice_ceiling(self):
        """Round, even tops so the middle tick is whole."""
        self.assertEqual(charts.nice_ceiling(0), 2)
        for value in (5, 37, 999):
            top = charts.nice_ceiling(value)
            self.assertGreaterEqual(top, value)
            self.assertEqual(top % 2, 0)

    def test_column_chart(self):
        """Bars scaled to the ceiling, tooltips, totals."""
        chart = charts.column_chart([("1", 0, "Ngày 1"), ("2", 4, "Ngày 2")], unit="lượt")
        self.assertEqual(len(chart["bars"]), 2)
        self.assertTrue(chart["bars"][0]["empty"])
        self.assertIn("Ngày 2: 4 lượt", chart["bars"][1]["tip"])
        self.assertEqual(len(chart["ticks"]), 3)

    def test_delta(self):
        """None without a baseline; direction and rounded pct otherwise."""
        self.assertIsNone(charts.delta(5, 0))
        self.assertEqual(charts.delta(42, 30), {"pct": 40, "direction": "up"})
        self.assertEqual(charts.delta(10, 20)["direction"], "down")
        self.assertEqual(charts.delta(100, 100)["direction"], "flat")


class VnTextTests(SimpleTestCase):
    """admin_ui/vn_text.py."""

    def test_group_digits_and_duration(self):
        """450000 -> 450.000; 90s -> '1 phút 30 giây'."""
        self.assertEqual(vn_text.group_digits(450000), "450.000")
        self.assertEqual(vn_text.duration_text(90), "1 phút 30 giây")

    def test_strip_accents(self):
        """Marks and đ removed, lower-cased (for search)."""
        self.assertEqual(vn_text.strip_vn_accents("Đặng Thị Mỹ"), "dang thi my")


class TemplateTagTests(SimpleTestCase):
    """admin_ui/templatetags/admin_ui.py."""

    def test_icon_markup(self):
        """SVG <use> into the sprite."""
        html = tags.icon("home", "big")
        self.assertIn('class="hv-i big"', html)
        self.assertIn("admin-icons.svg#home", html)

    def test_initials(self):
        """Last+first initials, else username."""
        self.assertEqual(tags.initials(SimpleNamespace(first_name="Viet", last_name="Mai", username="x")), "MV")
        self.assertEqual(tags.initials(SimpleNamespace(first_name="", last_name="", username="boss")), "BO")

    def test_labels(self):
        """Weekday label and a greeting."""
        self.assertIn("tháng", tags.today_label())
        self.assertTrue(tags.greeting().startswith("Chào buổi"))
        self.assertEqual(tags.digits(1000000), "1.000.000")


class NavTests(TestCase):
    """build_nav from the admin site."""

    def test_superuser_menu_and_active_item(self):
        """Configured sections, unknown models in 'Khác', longest-prefix active."""
        user = User.objects.create_superuser("boss", "b@x.vn", "pw")
        request = RequestFactory().get("/admin/accounts/account/1/change/")
        request.user = user
        sections = nav.build_nav(request)
        titles = [s["title"] for s in sections]
        self.assertEqual(titles[0], None)
        self.assertIn("Người dùng", titles)
        self.assertIn("Khác", titles)
        active = [i["name"] for s in sections for i in s["items"] if i["active"]]
        self.assertEqual(len(active), 1)
        self.assertNotEqual(active[0], "Tổng quan")

    def test_dashboard_only_active_on_itself(self):
        """/admin/ is a prefix of everything."""
        user = User.objects.create_superuser("boss", "b@x.vn", "pw")
        request = RequestFactory().get("/admin/")
        request.user = user
        first = nav.build_nav(request)[0]["items"][0]
        self.assertTrue(first["active"])


class AdminPagesTests(TestCase):
    """The skin renders the stock admin pages."""

    def setUp(self):
        """Signed-in superuser."""
        User.objects.create_superuser("boss", "b@x.vn", "pw")

    def test_login_page(self):
        """Standalone sign-in page with the kit's CSS and the site header."""
        r = self.client.get("/admin/login/")
        self.assertContains(r, "hv-login-shell")
        self.assertContains(r, "admin_ui/css/admin.css")
        self.assertContains(r, "TestApp")

    def test_shell_pages(self):
        """Dashboard, changelist, add form, app index, user list."""
        self.client.login(username="boss", password="pw")
        for url in ("/admin/", "/admin/accounts/account/", "/admin/accounts/account/add/", "/admin/accounts/", "/admin/auth/user/", "/admin/payments/topuporder/"):
            r = self.client.get(url)
            self.assertEqual(r.status_code, 200, url)
            self.assertContains(r, "hv-sidebar")
            self.assertContains(r, "data-hv-theme-toggle")

    def test_logout_page(self):
        """Signed-out card."""
        self.client.login(username="boss", password="pw")
        self.assertContains(self.client.post("/admin/logout/"), "hv-login-done")


class ChartExtraTests(SimpleTestCase):
    """compact() and share_rows()."""

    def test_compact_labels(self):
        """tr / N suffixes with a decimal comma."""
        self.assertEqual(charts.compact(1_200_000), "1,2 tr")
        self.assertEqual(charts.compact(45_000), "45 N")
        self.assertEqual(charts.compact(4_500), "4.500")

    def test_share_rows(self):
        """Against the largest by default, against a total when given."""
        rows = charts.share_rows([{"value": 50}, {"value": 25}])
        self.assertEqual([r["pct"] for r in rows], [charts.css_pct(100), charts.css_pct(50)])
        self.assertEqual(charts.share_rows([{"value": 25}], total=100)[0]["share"], 25)
        self.assertEqual(charts.share_rows([]), [])
