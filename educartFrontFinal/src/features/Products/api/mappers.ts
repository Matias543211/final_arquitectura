import type {
  IProduct,
  ICategory,
  NewProductPayload,
  UpdateProductPayload,
} from "../types/Product";

export interface ProductApi {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image_url?: string;
  category: { id: number; name: string } | null;
  stock_current: number;
  stock_min: number;
  sku?: string;
}

export function toProduct(api: ProductApi): IProduct {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    price: api.price,
    rating: api.rating,
    imageUrl: api.image_url,
    category: api.category?.name || "Sin categoría",
    stock: api.stock_current,
    stock_min: api.stock_min,
    sku: api.sku,
  };
}


export function toProductApiCreate(
  payload: NewProductPayload
): Partial<ProductApi> & { category_id?: number } {
  return {
    name: payload.name,
    description: payload.description,
    price: payload.price,
    rating: payload.rating,
    category_id: payload.category_id,
    image_url: payload.image_url,
    stock_current: payload.stock_current,
    stock_min: payload.stock_min,
    sku: payload.sku,
  };
}


export function toProductApiUpdate(
  payload: UpdateProductPayload
): Partial<ProductApi> & { category_id?: number } {
  return {
    ...(payload.name && { name: payload.name }),
    ...(payload.description && { description: payload.description }),
    ...(payload.price && { price: payload.price }),
    ...(payload.rating && { rating: payload.rating }),
    ...(payload.category_id && { category_id: payload.category_id }),
  };
}

export interface CategoryApi {
  id: number;
  name: string;
}
export function toCategory(api: CategoryApi): ICategory {
  return {
    id: api.id,
    name: api.name,
  };
}