export interface IOrderItem {
    productId: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        imageUrl: string;
    };
}

export interface IOrder {
    id: number;
    userId: number;
    orderDate: string;
    status: string;
    shippingAddress: string;
    locality: string;
    total: number;
    items: IOrderItem[];
}


export interface OrderItemApi {
    product_id: number;
    quantity: number;
    unit_price: number;
    product: {
        id: number;
        name: string;
        image_url: string;
    };
}

export interface OrderApi {
    id: number;
    user_id: number;
    order_date: string;
    status: string;
    shipping_address: string;
    locality: string;
    total_amount: number;
    items: OrderItemApi[];
}

export interface CreateOrderPayload {
    shipping_address: string;
    locality: string;
}
