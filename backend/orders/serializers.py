from rest_framework import serializers

from accounts.serializers import AddressSerializer

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    product_image = serializers.ImageField(
        source="product.image",
        read_only=True,
    )

    class Meta:
        model = OrderItem

        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
            "total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    address_details = AddressSerializer(
        source="address",
        read_only=True,
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "address",
            "address_details",
            "items",
            "subtotal",
            "delivery_fee",
            "total",
            "payment_method",
            "payment_status",
            "order_status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "order_number",
            "address_details",
            "subtotal",
            "delivery_fee",
            "total",
            "payment_status",
            "order_status",
            "created_at",
            "updated_at",
        ]