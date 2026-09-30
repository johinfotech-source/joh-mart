from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )

    price = serializers.ReadOnlyField()
    total = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
            "total",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "items",
            "subtotal",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]