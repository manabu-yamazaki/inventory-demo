import { useState, useEffect } from "react";
import { ProductCategory } from "@/types/inventory";
import { createProductWithInventory, getProductCategories } from "@/lib/inventory";
import { toast } from "sonner";

interface ProductFormProps {
  onSuccess?: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    sku: "",
    unit: "",
    min_stock_level: 0,
    location: "",
    initial_quantity: 0,
  });

  const loadCategories = async () => {
    try {
      const data = await getProductCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("カテゴリーの読み込みに失敗しました");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProductWithInventory(
        {
          category_id: formData.category_id,
          name: formData.name,
          description: formData.description,
          sku: formData.sku,
          unit: formData.unit,
          min_stock_level: formData.min_stock_level,
        },
        formData.location,
        formData.initial_quantity
      );

      toast.success("商品を登録しました");
      setFormData({
        category_id: "",
        name: "",
        description: "",
        sku: "",
        unit: "",
        min_stock_level: 0,
        location: "",
        initial_quantity: 0,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("商品の登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          カテゴリー
        </label>
        <select
          id="category"
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">カテゴリーを選択</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          商品名
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
          SKU
        </label>
        <input
          type="text"
          id="sku"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
          単位
        </label>
        <input
          type="text"
          id="unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="min_stock_level" className="block text-sm font-medium text-gray-700">
          最小在庫数
        </label>
        <input
          type="number"
          id="min_stock_level"
          value={formData.min_stock_level}
          onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt(e.target.value) })}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          保管場所
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="例: 倉庫A-1"
        />
      </div>

      <div>
        <label htmlFor="initial_quantity" className="block text-sm font-medium text-gray-700">
          初期在庫数
        </label>
        <input
          type="number"
          id="initial_quantity"
          value={formData.initial_quantity}
          onChange={(e) => setFormData({ ...formData, initial_quantity: parseInt(e.target.value) || 0 })}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <p className="mt-1 text-sm text-gray-500">
          初期在庫数を設定しない場合は0となります
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "登録中..." : "登録"}
        </button>
      </div>
    </form>
  );
} 