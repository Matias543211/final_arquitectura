
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import type { IProduct } from "../types/Product";

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({

        mutationFn: (productId) => productService.delete(productId),
        onSuccess: (_, deletedProductId) => {

            queryClient.invalidateQueries({ queryKey: ["products"] });

            queryClient.setQueryData<IProduct[]>(["products"], (oldProducts) => {
                if (!oldProducts) return [];

                return oldProducts.filter((p) => p.id !== deletedProductId);
            });

            queryClient.removeQueries({ queryKey: ["products", deletedProductId] });
        },

        onError: (error) => {
            console.error("Error al eliminar el producto:", error);
        },
    });
}