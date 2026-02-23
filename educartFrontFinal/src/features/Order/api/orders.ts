import { apiClient } from "../../../services/apiClient";
import type { IOrder, CreateOrderPayload, OrderApi } from "../types/Order";
import { toOrder } from "./mappers";

export async function createOrder(payload: CreateOrderPayload): Promise<IOrder> {
    const response = await apiClient.post<OrderApi>("/orders", payload);
    return toOrder(response.data);
}

export async function getMyOrders(): Promise<IOrder[]> {
    const response = await apiClient.get<OrderApi[]>("/orders/my-orders");
    return response.data.map(toOrder);
}