export interface ICategory {
  id: number;
  name: string;
}


export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  imageUrl?: string;
  category: string;
  stock: number;
  stock_min: number;
  sku?: string;
}

export type NewProductPayload = {
  name: string;
  description: string;
  price: number;
  rating: number;
  category_id: number;
  image_url: string;
  stock_current: number;
  stock_min: number;
  sku?: string;
};

export type UpdateProductPayload = Partial<NewProductPayload>;
