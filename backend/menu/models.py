from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify

from config.labels import label as L

PRICE = {"max_digits": 8, "decimal_places": 2, "validators": [MinValueValidator(Decimal("0"))]}


class MenuCategory(models.Model):
    """One tab on the website menu page (Brunch, Açai, Coffee & Drinks, Bar)."""

    class PriceStyle(models.TextChoices):
        DOLLAR = "dollar", L("$25.9 — with $, no trailing zeros", "$25.9 — có dấu $, bỏ số 0 thừa")
        FIXED = "fixed", L("4.20 — always two decimals", "4.20 — luôn 2 chữ số thập phân")

    slug = models.SlugField(
        L("Tab code", "Mã tab"), max_length=40, unique=True,
        help_text=L(
            "Used in the link, e.g. /menu/#bar. Lowercase letters, digits and hyphens only.",
            "Dùng trong đường dẫn, ví dụ /menu/#bar. Chỉ chữ thường, số và dấu gạch ngang.",
        ),
    )
    name = models.CharField(L("Tab name", "Tên tab"), max_length=60)
    price_style = models.CharField(
        L("Price format", "Kiểu hiển thị giá"), max_length=10, choices=PriceStyle.choices, default=PriceStyle.DOLLAR
    )
    order = models.PositiveSmallIntegerField(L("Order", "Thứ tự"), default=0)
    is_active = models.BooleanField(L("Shown on website", "Hiển thị trên website"), default=True)
    updated_at = models.DateTimeField(L("Updated", "Cập nhật lúc"), auto_now=True)

    class Meta:
        ordering = ("order", "id")
        verbose_name = L("Menu category", "Danh mục menu")
        verbose_name_plural = L("Menu categories", "Danh mục menu")

    def __str__(self):
        return self.name

    def format_price(self, value):
        """Printed price in this tab's style; None for "not offered"."""
        if value is None:
            return None
        text = f"{value:.2f}"
        if self.price_style == self.PriceStyle.DOLLAR:
            return "$" + text.rstrip("0").rstrip(".")
        return text


class MenuSection(models.Model):
    """A titled block inside a tab (All Day, Sweet, Red, Cocktails...)."""

    class Kind(models.TextChoices):
        STANDARD = "standard", L("Item list with prices", "Danh sách món có giá")
        ACAI = "acai", L("Item list priced by a shared table (Açai)", "Danh sách món dùng bảng giá chung (Açai)")
        WINE = "wine", L("Wine list — glass / bottle", "Rượu vang — giá ly / chai")
        PRICING = "pricing", L("Price table by size / service", "Bảng giá theo size / hình thức")
        NOTICE = "notice", L("Notice (no items)", "Ghi chú (không có món)")

    LIST_KINDS = (Kind.STANDARD, Kind.ACAI, Kind.WINE)

    category = models.ForeignKey(
        MenuCategory, verbose_name=L("Category", "Danh mục"), on_delete=models.CASCADE, related_name="sections"
    )
    kind = models.CharField(L("Section type", "Loại nhóm"), max_length=10, choices=Kind.choices, default=Kind.STANDARD)
    title = models.CharField(L("Title", "Tiêu đề"), max_length=120, blank=True)
    note = models.TextField(
        L("Note", "Ghi chú"), blank=True,
        help_text=L(
            "Italic line under the title. For a Notice section this is the text shown.",
            "Dòng chữ nghiêng dưới tiêu đề. Với nhóm Ghi chú, đây là nội dung hiển thị.",
        ),
    )
    order = models.PositiveSmallIntegerField(L("Order", "Thứ tự"), default=0)
    is_active = models.BooleanField(L("Shown", "Hiển thị"), default=True)
    updated_at = models.DateTimeField(L("Updated", "Cập nhật lúc"), auto_now=True)

    class Meta:
        ordering = ("category__order", "order", "id")
        verbose_name = L("Menu section", "Nhóm món")
        verbose_name_plural = L("Menu sections", "Nhóm món")

    def __str__(self):
        return f"{self.category.name} · {self.title or self.get_kind_display()}"

    def clean(self):
        if self.kind != self.Kind.PRICING and not self.title.strip():
            raise ValidationError({"title": L("Enter a title for this section.", "Vui lòng nhập tiêu đề cho nhóm này.")})
        if self.kind == self.Kind.NOTICE and not self.note.strip():
            raise ValidationError({"note": L("A notice needs some text.", "Nhóm Ghi chú cần có nội dung.")})


class MenuItem(models.Model):
    section = models.ForeignKey(
        MenuSection, verbose_name=L("Section", "Nhóm món"), on_delete=models.CASCADE, related_name="items"
    )
    slug = models.SlugField(
        L("Item code", "Mã món"), max_length=100, unique=True, blank=True,
        help_text=L(
            "Leave blank to create it from the name. No need to change it when renaming.",
            "Để trống để tự tạo từ tên món. Không cần đổi khi sửa tên.",
        ),
    )
    name = models.CharField(L("Name", "Tên món"), max_length=120)
    description = models.TextField(L("Description", "Mô tả"), blank=True)
    price = models.DecimalField(L("Price (AUD)", "Giá (AUD)"), null=True, blank=True, **PRICE)
    region = models.CharField(
        L("Region", "Vùng / xuất xứ"), max_length=120, blank=True, help_text=L("Wine only.", "Chỉ dùng cho rượu vang.")
    )
    glass_price = models.DecimalField(
        L("Glass (AUD)", "Giá ly (AUD)"), null=True, blank=True,
        help_text=L("Leave blank if not sold by the glass.", "Để trống nếu không bán theo ly."), **PRICE,
    )
    bottle_price = models.DecimalField(
        L("Bottle (AUD)", "Giá chai (AUD)"), null=True, blank=True,
        help_text=L("Leave blank if not sold by the bottle.", "Để trống nếu không bán theo chai."), **PRICE,
    )
    order = models.PositiveSmallIntegerField(L("Order", "Thứ tự"), default=0)
    is_available = models.BooleanField(L("Available", "Đang bán"), default=True)
    updated_at = models.DateTimeField(L("Updated", "Cập nhật lúc"), auto_now=True)

    class Meta:
        ordering = ("section__category__order", "section__order", "order", "id")
        verbose_name = L("Menu item", "Món")
        verbose_name_plural = L("Menu items", "Món ăn & đồ uống")

    def __str__(self):
        return self.name

    def clean(self):
        section = getattr(self, "section", None)
        if section is None:
            return
        kind = section.kind
        if kind not in MenuSection.LIST_KINDS:
            raise ValidationError({"section": L(
                "This section does not hold items. Pick an item list.",
                "Nhóm này không chứa món. Chọn một nhóm danh sách món.",
            )})
        if kind == MenuSection.Kind.STANDARD and self.price is None:
            raise ValidationError({"price": L("Enter a price.", "Vui lòng nhập giá.")})
        if kind == MenuSection.Kind.WINE and self.glass_price is None and self.bottle_price is None:
            raise ValidationError({"glass_price": L(
                "A wine needs a glass or a bottle price.", "Rượu vang cần ít nhất giá ly hoặc giá chai."
            )})
        if kind == MenuSection.Kind.ACAI and not self.description.strip():
            raise ValidationError({"description": L("Açai items need a description.", "Món Açai cần có mô tả.")})

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(f"{self.section.category.slug}-{self.name}")[:90] or "item"
            slug, n = base, 2
            while MenuItem.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug, n = f"{base}-{n}", n + 1
            self.slug = slug
        super().save(*args, **kwargs)


class PriceOption(models.Model):
    """One row of a pricing table, e.g. Takeaway / Small / $16.9."""

    section = models.ForeignKey(
        MenuSection, verbose_name=L("Price table", "Bảng giá"), on_delete=models.CASCADE, related_name="price_rows"
    )
    group = models.CharField(L("Group", "Nhóm"), max_length=60, help_text=L("e.g. Takeaway, Dine In.", "Ví dụ: Takeaway, Dine In."))
    label = models.CharField(L("Option", "Lựa chọn"), max_length=60, help_text=L("e.g. Small, Large, Bowl.", "Ví dụ: Small, Large, Bowl."))
    price = models.DecimalField(L("Price (AUD)", "Giá (AUD)"), **PRICE)
    order = models.PositiveSmallIntegerField(L("Order", "Thứ tự"), default=0)
    updated_at = models.DateTimeField(L("Updated", "Cập nhật lúc"), auto_now=True)

    class Meta:
        ordering = ("order", "id")
        verbose_name = L("Price row", "Dòng giá")
        verbose_name_plural = L("Price table", "Bảng giá")

    def __str__(self):
        return f"{self.group} · {self.label}"
