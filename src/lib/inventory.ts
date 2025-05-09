import { supabase } from './supabase';
import { Product, ProductCategory, Inventory, InventoryHistory } from '@/types/inventory';

// 商品カテゴリー関連の関数
export async function getProductCategories() {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as ProductCategory[];
}

export async function createProductCategory(category: Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('product_categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data as ProductCategory;
}

// 商品関連の関数
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*)
    `)
    .order('name');

  if (error) throw error;
  return data as Product[];
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

// 在庫関連の関数
export async function getInventory() {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      product:products(
        *,
        category:product_categories(*)
      )
    `)
    .order('product(name)', { ascending: true });

  if (error) throw error;
  return data as Inventory[];
}

export async function getInventoryByProduct(productId: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      product:products(
        *,
        category:product_categories(*)
      )
    `)
    .eq('product_id', productId)
    .single();

  if (error) throw error;
  return data as Inventory;
}

// 在庫履歴関連の関数
export async function getInventoryHistory(productId?: string) {
  let query = supabase
    .from('inventory_history')
    .select(`
      *,
      product:products(
        *,
        category:product_categories(*)
      ),
      created_by_user:user_profiles(email, name)
    `)
    .order('created_at', { ascending: false });

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as InventoryHistory[];
}

// 在庫調整関連の関数
export async function adjustInventory(
  productId: string,
  quantityChange: number
) {
  const currentInventory = await getInventoryByProduct(productId);
  const newQuantity = (currentInventory?.quantity || 0) + quantityChange;

  const { data, error } = await supabase
    .from('inventory')
    .upsert({
      id: currentInventory?.id,
      product_id: productId,
      quantity: newQuantity,
      location: currentInventory?.location,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Inventory;
}

// 商品と在庫を同時に登録する関数
export async function createProductWithInventory(
  product: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
  location: string,
  initialQuantity: number = 0
) {
  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (productError) throw productError;

  const { data: inventoryData, error: inventoryError } = await supabase
    .from('inventory')
    .insert({
      product_id: productData.id,
      quantity: initialQuantity,
      location,
    })
    .select()
    .single();

  if (inventoryError) {
    // 在庫登録に失敗した場合、商品も削除
    await supabase.from('products').delete().eq('id', productData.id);
    throw inventoryError;
  }

  return {
    product: productData as Product,
    inventory: inventoryData as Inventory,
  };
} 