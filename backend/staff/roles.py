"""
Ready-made roles (Django groups) for a café team.

They are created after `migrate` when missing, so a fresh database starts with them.
A role that already exists is never touched: changes made in the admin are kept.
"""

from django.contrib.auth.models import Group

from .permissions import managed_permissions, split

ALL = ("view", "add", "change", "delete")
MENU = ("menuitem", "menusection", "priceoption", "menucategory")

# name -> (description, {(app, model): actions})
ROLES = {
    "Manager": (
        "Runs the venue: bookings, the whole menu, and staff accounts. Cannot delete accounts or change roles.",
        {
            ("bookings", "bookingrequest"): ALL,
            **{("menu", m): ALL for m in MENU},
            ("auth", "user"): ("view", "add", "change"),
            ("auth", "group"): ("view",),
        },
    ),
    "Front of house": (
        "Handles table requests: confirms, updates and adds phone bookings. Can look up the menu.",
        {
            ("bookings", "bookingrequest"): ("view", "add", "change"),
            ("menu", "menuitem"): ("view",),
        },
    ),
    "Menu editor": (
        "Keeps the menu current: prices, sold-out items, new dishes and sections. Can see bookings.",
        {
            ("bookings", "bookingrequest"): ("view",),
            **{("menu", m): ALL for m in MENU},
        },
    ),
    "View only": (
        "Can look at bookings and the menu without changing anything.",
        {
            ("bookings", "bookingrequest"): ("view",),
            **{("menu", m): ("view",) for m in MENU},
        },
    ),
}


def describe(group_name):
    role = ROLES.get(group_name)
    return role[0] if role else ""


def create_default_roles(**kwargs):
    """post_migrate: add any preset role that does not exist yet."""
    permissions = list(managed_permissions())
    for name, (_, grants) in ROLES.items():
        group, created = Group.objects.get_or_create(name=name)
        if not created:
            continue
        group.permissions.set(
            p for p in permissions if split(p)[2] in grants.get(split(p)[:2], ())
        )
