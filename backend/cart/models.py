from django.contrib.auth.models import User
from django.db import models

from products.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="cart"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart - {self.user.username}"

    @property
    def subtotal(self):
        return sum(
            item.total
            for item in self.items.all()
        )


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(
        default=1
    )

    class Meta:
        unique_together = (
            "cart",
            "product",
        )

    @property
    def price(self):
        return self.product.final_price

    @property
    def total(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"