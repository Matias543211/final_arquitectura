import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/apiClient";
import { IOrder } from "@/features/Order/types/Order"; // Usa tus tipos existentes
import { toOrder } from "@/features/Order/api/mappers"; // Usa tus mappers

export const useAdminOrders = () => {
    return useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const { data } = await apiClient.get("/orders/admin/all");
            return data.map(toOrder); // Mapeamos snake_case a camelCase
        },
    });
};