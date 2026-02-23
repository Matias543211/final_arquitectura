// src/features/products/hooks/useProduct.ts
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import type { IProduct } from "../types/Product";

export function useProduct(id: number) {
    return useQuery<IProduct, Error>({
        queryKey: ["product", id],
        queryFn: () => productService.getById(id),
        enabled: !!id && !isNaN(id), // Solo ejecuta si el ID es válido
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}