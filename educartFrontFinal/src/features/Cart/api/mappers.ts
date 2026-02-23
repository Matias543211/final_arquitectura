import type { ICart, ICartItem, CartApi, CartItemApi, CartItemPayload } from "../types/Cart";

export function toCart(apiData: CartApi): ICart {
  return {
    id: apiData.id,
    userId: apiData.user_id,
    total: apiData.total,
    items: apiData.items.map(toCartItem),
  };
}

export function toCartItem(apiItem: CartItemApi): ICartItem {
  return {
    cartId: apiItem.cart_id,
    productId: apiItem.product_id,
    name: apiItem.product.name,
    quantity: apiItem.quantity,
    price: apiItem.product.price,
    image_url: apiItem.product.image_url,
    
  };
}

export function toCartApiAdd(payload: CartItemPayload) {
  return {
    product_id: payload.product_id,
    quantity: payload.quantity,
  };
}
