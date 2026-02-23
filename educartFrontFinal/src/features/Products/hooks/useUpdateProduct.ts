import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import type { IProduct } from "../types/Product";


type UpdateProductPayload = {
    id: number;
    name: string;
    price: number;
    category: string;
};


export function useUpdateProduct() {

    const queryClient = useQueryClient();

    return useMutation<IProduct, Error, UpdateProductPayload>({


        mutationFn: (updatedData) => productService.update(updatedData.id, updatedData),

        onSuccess: (updatedProduct) => {

            queryClient.invalidateQueries({ queryKey: ["products"] });


            queryClient.setQueryData<IProduct[]>(["products"], (oldProducts) => {
                if (!oldProducts) return [];

                return oldProducts.map((p) =>
                    p.id === updatedProduct.id ? updatedProduct : p
                );
            });


            queryClient.setQueryData<IProduct>(["products", updatedProduct.id], updatedProduct);
        },

        onError: (error, variables) => {
            console.error("Error al actualizar el producto:", error);
        },
    });
}