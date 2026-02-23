import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // 1. Importar hook de URL
import {
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";

import { ProductFilters, type FilterState } from "../components/ProductFilter";
import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useProducts";


export const ProductsPage: React.FC = () => {


  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    categories: [] as string[],
    price_min: undefined as number | undefined,
    price_max: undefined as number | undefined,
    sort: "featured",
  });


  useEffect(() => {
    const categoryParams = searchParams.getAll("category"); // Obtiene todos los ?category=...
    const minPrice = searchParams.get("min") ? Number(searchParams.get("min")) : undefined;
    const maxPrice = searchParams.get("max") ? Number(searchParams.get("max")) : undefined;
    const sortParam = searchParams.get("sort") || "featured";

    setFilters({
      categories: categoryParams,
      price_min: minPrice,
      price_max: maxPrice,
      sort: sortParam,
    });
  }, [searchParams]);


  const handleFilterChange = (newFilters: typeof filters) => {
    const params = new URLSearchParams();

    newFilters.categories.forEach(cat => params.append("category", cat));

    if (newFilters.price_min) params.set("min", newFilters.price_min.toString());
    if (newFilters.price_max) params.set("max", newFilters.price_max.toString());

    setSearchParams(params);
  };


  const handleSortChange = (keys: any) => {
    const selectedSort = Array.from(keys)[0] as string;

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", selectedSort);
      return newParams;
    });
  };

  const { data: products, isLoading } = useProducts(filters);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50 dark:bg-neutral-900 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Catálogo Educativo
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters
            currentFilters={filters}
            onApply={handleFilterChange}
          />
        </aside>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <span className="text-gray-500 text-sm">
              Mostrando {products?.length || 0} productos
            </span>

            <div className="w-full sm:w-auto">
              <Select
                label="Ordenar por"
                placeholder="Selecciona orden"
                className="w-52"
                size="sm"
                variant="bordered"
                selectedKeys={filters.sort ? [filters.sort] : ["featured"]}
                onSelectionChange={handleSortChange}
              >
                <SelectItem key="featured">Destacados</SelectItem>
                <SelectItem key="price_asc">Precio: Bajo a Alto</SelectItem>
                <SelectItem key="price_desc">Precio: Alto a Bajo</SelectItem>
                <SelectItem key="newest">Más recientes</SelectItem>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner label="Cargando..." /></div>
          ) : (
            <ProductList isLoading={isLoading} products={products} />
          )}
        </div>
      </div>
    </main>
  );
};