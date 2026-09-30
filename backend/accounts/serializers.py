from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Address


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
        ]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
        ]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "name",
            "phone",
            "address_line",
            "city",
            "pincode",
            "landmark",
            "is_default",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]

    def create(self, validated_data):
        return Address.objects.create(
            **validated_data
        )