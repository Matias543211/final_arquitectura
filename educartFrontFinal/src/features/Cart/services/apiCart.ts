import { apiClient } from "../../../services/apiClient";
import type { IProduct } from "../../Products/types/Product";

export interface CartItem {
  id: number;
  product: IProduct;
  quantity: number;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
}

export const getCart = async (): Promise<Cart> => {
  const { data } = await apiClient.get(`/cart`);
  return data;
};

export const addItemToCart = async (productId: number, quantity: number) => {
  const { data } = await apiClient.post(`/cart`, {
    product_id: productId,
    quantity,
  });
  return data;
};

export const updateItemQuantity = async (productId: number, quantity: number) => {
  const { data } = await apiClient.put(`/cart`, {
    product_id: productId,
    quantity,
  });
  return data;
};

export const removeItemFromCart = async (itemId: number) => {
  const { data } = await apiClient.delete(`/cart/items/${itemId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await apiClient.delete(`/cart`);
  return data;
};

