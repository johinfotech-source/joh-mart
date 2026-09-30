from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        "product",
        "quantity",
        "price",
        "total",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "user",
        "total",
        "payment_method",
        "payment_status",
        "order_status",
        "created_at",
    )

    list_filter = (
        "order_status",
        "payment_status",
        "payment_method",
        "created_at",
    )

    search_fields = (
        "order_number",
        "user__username",
        "user__email",
    )

    readonly_fields = (
        "order_number",
        "user",
        "address",
        "subtotal",
        "delivery_fee",
        "total",
        "payment_method",
        "payment_status",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )

    inlines = [
        OrderItemInline,
    ]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "product",
        "quantity",
        "price",
        "total",
    )

    search_fields = (
        "order__order_number",
        "product__name",
    )