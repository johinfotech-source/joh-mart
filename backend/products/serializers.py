from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "image",
            "is_active",
            "created_at",
        ]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    final_price = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "description",
            "price",
            "discount_price",
            "final_price",
            "image",
            "stock",
            "rating",
            "is_available",
            "created_at",
            "updated_at",
        ]