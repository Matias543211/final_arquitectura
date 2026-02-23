import type { IOrder, IOrderItem, OrderApi, OrderItemApi } from "../types/Order";

export function toOrderItem(api: OrderItemApi): IOrderItem {
    return {
        productId: api.product_id,
        quantity: api.quantity,
        price: api.unit_price,
        product: {
            id: api.product?.id,
            name: api.product?.name || "Producto Desconocido",
            imageUrl: api.product?.image_url || "",
        }
    };
}

export function toOrder(api: OrderApi): IOrder {
    return {
        id: api.id,
        userId: api.user_id,
        orderDate: api.order_date,
        status: api.status,
        shippingAddress: api.shipping_address,
        locality: api.locality,
        total: api.total_amount,
        items: api.items.map(toOrderItem),
    };
}