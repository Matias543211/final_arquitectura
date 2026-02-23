import * as orderApi from "../api/orders";
import type { IOrder, CreateOrderPayload } from "../types/Order";

export const orderService = {
    create: async (payload: CreateOrderPayload): Promise<IOrder> => {
        return await orderApi.createOrder(payload);
    },

    getMyOrders: async (): Promise<IOrder[]> => {
        return await orderApi.getMyOrders();
    },
};