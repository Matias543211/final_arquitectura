import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { useCart } from "../../Cart/hooks/useCart";
import { useNavigate } from "react-router";
import type { CreateOrderPayload } from "../types/Order";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/services/apiClient";


export const useMyOrders = () => {
    return useQuery({
        queryKey: ["my-orders"],
        queryFn: orderService.getMyOrders,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};


export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { emptyCart } = useCart();

    return useMutation({
        mutationFn: (payload: CreateOrderPayload) => orderService.create(payload),
        onSuccess: async () => {
            // Vaciar carrito
            await emptyCart();

            // Invalidar caché para que se recargue la lista de órdenes
            queryClient.invalidateQueries({ queryKey: ["my-orders"] });

            // Redirigir
            navigate("/my-orders");
        },
        onError: (error: any) => {
            console.error("Error creating order:", error);
        },
    });
};


export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const res = await apiClient.patch(`/orders/${id}/status`, { status });
            return res.data;
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            addToast("¡Gracias por confirmar la entrega!", "success");
        },
        onError: () => {
            addToast("Error al actualizar la orden", "error");
        },
    });
};