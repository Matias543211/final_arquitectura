import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CheckboxGroup,
  Checkbox,
  Slider,
  Button,
  Divider,
  Skeleton
} from "@heroui/react";
import { useCategories } from "../../Products/hooks/useCategory";

export interface FilterState {
  categories: string[];
  price_min?: number;
  price_max?: number;
  sort?: string;
}

interface ProductFiltersProps {
  currentFilters: FilterState; // Filtros que vienen de la URL
  onApply: (filters: FilterState) => void; // Función que actualiza la URL
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ currentFilters, onApply }) => {
  const { data: categories = [], isLoading } = useCategories();

  // 1. ESTADO LOCAL: Mantiene los cambios temporales antes de aplicar
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  // 2. SINCRONIZACIÓN: Si la URL cambia externamente (ej: botones atrás/adelante), actualizamos lo local
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);


  const handleCategoryChange = (values: string[]) => {
    setLocalFilters((prev) => ({ ...prev, categories: values }));
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalFilters((prev) => ({
        ...prev,
        price_min: value[0],
        price_max: value[1],
      }));
    }
  };

  const handleApplyClick = () => {
    onApply(localFilters);
  };


  const handleClearClick = () => {
    const emptyFilters = { categories: [], price_min: 0, price_max: 1000 };
    setLocalFilters(emptyFilters);
    onApply(emptyFilters);
  };

  return (
    <Card className="sticky top-12 h-auto shadow-sm border border-gray-100 dark:border-neutral-800">
      <CardBody className="p-6 gap-6">

        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">Filtros</h3>
        </div>

        <Divider />

        {/* Categorías */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Categorías</h4>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="rounded-lg h-6 w-3/4" />
              <Skeleton className="rounded-lg h-6 w-1/2" />
            </div>
          ) : (
            <CheckboxGroup
              // Usamos el estado LOCAL
              value={localFilters.categories}
              onValueChange={handleCategoryChange}
              color="primary"
              className="gap-2"
            >
              {categories.map((cat) => (
                <Checkbox key={cat.id} value={cat.name} classNames={{ label: "text-sm text-gray-600 dark:text-gray-300" }}>
                  {cat.name}
                </Checkbox>
              ))}
            </CheckboxGroup>
          )}
        </div>

        <Divider />

        <div>
          <h4 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Rango de Precio</h4>
          <Slider
            label="Precio"
            step={10}
            minValue={0}
            maxValue={1000}
            // Usamos el estado LOCAL
            value={[localFilters.price_min || 0, localFilters.price_max || 1000]}
            onChange={handlePriceChange}
            formatOptions={{ style: "currency", currency: "USD" }}
            className="max-w-md"
            size="sm"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>${localFilters.price_min || 0}</span>
            <span>${localFilters.price_max || 1000}+</span>
          </div>
        </div>

      </CardBody>

      <Divider />

      <CardFooter className="p-4 gap-3">
        <Button
          fullWidth
          variant="flat"
          color="danger"
          onPress={handleClearClick}
        >
          Limpiar
        </Button>
        <Button
          fullWidth
          color="primary"
          onPress={handleApplyClick}
          className="font-semibold shadow-md shadow-indigo-500/20"
        >
          Filtrar
        </Button>
      </CardFooter>
    </Card>
  );
};