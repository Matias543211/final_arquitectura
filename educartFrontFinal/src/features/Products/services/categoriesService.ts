import * as categoriesApi from "../api/categories";
import type { ICategory } from "../types/Product";

export const categoriesService = {

    getAll: async (): Promise<ICategory[]> => {
        return await categoriesApi.getCategories();
    },
};