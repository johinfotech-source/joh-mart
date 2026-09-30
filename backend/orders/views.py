import uuid
from decimal import Decimal

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Address
from cart.models import Cart

from .models import Order, OrderItem
from .serializers import OrderSerializer


DELIVERY_FEE = Decimal("30.00")


class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        address_id = request.data.get("address")

        if not address_id:
            return Response(
                {"error": "Address is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        address = get_object_or_404(
            Address,
            id=address_id,
            user=request.user
        )

        cart = get_object_or_404(
            Cart,
            user=request.user
        )

        cart_items = cart.items.select_related(
            "product"
        )

        if not cart_items.exists():
            return Response(
                {"error": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        subtotal = Decimal("0.00")

        for cart_item in cart_items:
            product = cart_item.product

            if not product.is_available:
                return Response(
                    {
                        "error": (
                            f"{product.name} is currently unavailable."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if cart_item.quantity > product.stock:
                return Response(
                    {
                        "error": (
                            f"Not enough stock for {product.name}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            subtotal += (
                product.final_price * cart_item.quantity
            )

        delivery_fee = DELIVERY_FEE
        total = subtotal + delivery_fee

        order_number = (
            f"JOH-{uuid.uuid4().hex[:10].upper()}"
        )

        order = Order.objects.create(
            user=request.user,
            address=address,
            order_number=order_number,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
            payment_method="COD",
            payment_status="PENDING",
            order_status="PLACED",
        )

        for cart_item in cart_items:
            product = cart_item.product
            price = product.final_price
            item_total = price * cart_item.quantity

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=cart_item.quantity,
                price=price,
                total=item_total,
            )

            product.stock -= cart_item.quantity
            product.save(
                update_fields=["stock"]
            )

        cart.items.all().delete()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(
            user=request.user
        ).prefetch_related(
            "items__product"
        )

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(
            Order.objects.prefetch_related(
                "items__product"
            ),
            id=order_id,
            user=request.user
        )

        serializer = OrderSerializer(order)

        return Response(serializer.data)