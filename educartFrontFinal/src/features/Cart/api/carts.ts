
import { apiClient } from "../../../services/apiClient";
import type { ICart, CartItemPayload } from "../types/Cart";
import { toCart, toCartApiAdd } from "./mappers";


export async function getCart(): Promise<ICart> {
  const response = await apiClient.get(`/cart`);
  return toCart(response.data);
}

export async function addToCart(payload: CartItemPayload): Promise<ICart> {
  const body = toCartApiAdd(payload);
  const response = await apiClient.post(`/cart`, body);
  return toCart(response.data);
}

export async function updateCartItem(payload: CartItemPayload): Promise<ICart> {
  const body = toCartApiAdd(payload);
  const response = await apiClient.put(`/cart`, body);
  return toCart(response.data);
}

export async function deleteCartItem(productId: number): Promise<ICart> {
  const response = await apiClient.delete(`/cart/items/${productId}`);
  return toCart(response.data);
}

export async function clearCart(): Promise<void> {
  await apiClient.delete(`/cart`);
}
