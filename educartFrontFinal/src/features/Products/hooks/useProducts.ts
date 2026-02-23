import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import type { IProduct } from "../types/Product";

export function useProducts(filters?: {
  categories?: string[];
  price_min?: number;
  price_max?: number;
  sort?: string;
}) {
  return useQuery<IProduct[], Error>({
    queryKey: ["products", filters],
    queryFn: () => productService.getAll(filters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
