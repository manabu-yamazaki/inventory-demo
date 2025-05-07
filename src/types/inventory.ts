export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  sku: string;
  unit: string;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
  category?: ProductCategory;
}

export interface Inventory {
  id: string;
  product_id: string;
  quantity: number;
  location?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface InventoryHistory {
  id: string;
  product_id: string;
  quantity_change: number;
  previous_quantity: number;
  new_quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason?: string;
  created_by: string;
  created_at: string;
  product?: Product;
  created_by_user?: {
    email: string;
    name?: string;
  };
} 