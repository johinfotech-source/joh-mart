from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product

from .models import Cart, CartItem
from .serializers import CartSerializer


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, user):
        cart, created = Cart.objects.get_or_create(
            user=user
        )
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)

        serializer = CartSerializer(cart)

        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product")
        quantity = request.data.get("quantity", 1)

        if not product_id:
            return Response(
                {"error": "Product ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {"error": "Quantity must be a number."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = get_object_or_404(
            Product,
            id=product_id,
            is_available=True
        )

        if product.stock < quantity:
            return Response(
                {"error": "Not enough stock available."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if item_created:
            cart_item.quantity = quantity
        else:
            new_quantity = cart_item.quantity + quantity

            if new_quantity > product.stock:
                return Response(
                    {"error": "Not enough stock available."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_item.quantity = new_quantity

        cart_item.save()

        serializer = CartSerializer(cart)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart=cart
        )

        quantity = request.data.get("quantity")

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {"error": "Quantity must be a number."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity > cart_item.product.stock:
            return Response(
                {"error": "Not enough stock available."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart)

        return Response(serializer.data)


class RemoveFromCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart=cart
        )

        cart_item.delete()

        serializer = CartSerializer(cart)

        return Response(serializer.data)


class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        cart.items.all().delete()

        serializer = CartSerializer(cart)

        return Response(serializer.data)