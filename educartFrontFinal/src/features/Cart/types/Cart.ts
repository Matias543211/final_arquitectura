export interface ICart {
  id: number;
  userId: number;
  items: ICartItem[];
  total: number;
}

export interface ICartItem {
  cartId: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
  image_url: string;
}

export interface CartApi {
  id: number;
  user_id: number;
  total: number;
  items: CartItemApi[];
}

export interface CartItemApi {
  cart_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
}

export interface CartItemPayload {
  product_id: number;
  quantity: number;
}
