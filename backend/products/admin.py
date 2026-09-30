from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "category",
        "price",
        "discount_price",
        "stock",
        "is_available",
        "rating",
    )

    list_filter = (
        "category",
        "is_available",
    )

    search_fields = (
        "name",
        "description",
    )

    ordering = ("-created_at",)