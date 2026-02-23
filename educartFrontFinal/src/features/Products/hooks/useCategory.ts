import { useQuery } from "@tanstack/react-query";
import type { ICategory } from "../types/Product";
import { categoriesService } from "../services/categoriesService";

export function useCategories() {
    return useQuery<ICategory[], Error>({
        queryKey: ["categories"],
        queryFn: () => categoriesService.getAll(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}
