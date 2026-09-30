from django.urls import path

from .views import (
    CartView,
    AddToCartView,
    UpdateCartItemView,
    RemoveFromCartView,
    ClearCartView,
)


urlpatterns = [
    path(
        "",
        CartView.as_view(),
        name="cart"
    ),

    path(
        "add/",
        AddToCartView.as_view(),
        name="cart-add"
    ),

    path(
        "items/<int:item_id>/",
        UpdateCartItemView.as_view(),
        name="cart-update"
    ),

    path(
        "items/<int:item_id>/remove/",
        RemoveFromCartView.as_view(),
        name="cart-remove"
    ),

    path(
        "clear/",
        ClearCartView.as_view(),
        name="cart-clear"
    ),
]