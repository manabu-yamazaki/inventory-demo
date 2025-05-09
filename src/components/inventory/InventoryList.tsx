import { Inventory } from "@/types/inventory";
import { adjustInventory } from "@/lib/inventory";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InventoryListProps {
  inventory: Inventory[];
  onUpdate?: () => void;
}

export function InventoryList({ inventory, onUpdate }: InventoryListProps) {
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    quantity: number;
    type: 'in' | 'out';
  } | null>(null);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    productName: '',
    categoryName: '',
    location: '',
  });

  // ユニークなカテゴリー名と保管場所のリストを取得
  const categories = useMemo(() => {
    const uniqueCategories = new Set(inventory.map(item => item.product?.category?.name).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [inventory]);

  const locations = useMemo(() => {
    const uniqueLocations = new Set(inventory.map(item => item.location).filter(Boolean));
    return Array.from(uniqueLocations);
  }, [inventory]);

  // フィルタリングされた在庫
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesProduct = (item.product?.name?.toLowerCase() ?? '').includes(filters.productName.toLowerCase());
      const matchesCategory = !filters.categoryName || item.product?.category?.name === filters.categoryName;
      const matchesLocation = !filters.location || item.location === filters.location;
      return matchesProduct && matchesCategory && matchesLocation;
    });
  }, [inventory, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAdjustment = async (productId: string, type: 'in' | 'out') => {
    const item = inventory.find(i => i.product_id === productId);
    if (!item) return;

    setSelectedItem({
      id: productId,
      quantity: 0,
      type,
    });
  };

  const confirmAdjustment = async () => {
    if (!selectedItem) return;

    try {
      setAdjusting(selectedItem.id);
      const quantityChange = selectedItem.type === 'in' 
        ? selectedItem.quantity 
        : -selectedItem.quantity;

      await adjustInventory(
        selectedItem.id,
        quantityChange
      );

      toast.success('在庫を更新しました');
      onUpdate?.();
    } catch (error) {
      console.error('Error adjusting inventory:', error);
      toast.error('在庫の更新に失敗しました');
    } finally {
      setAdjusting(null);
      setSelectedItem(null);
    }
  };

  return (
    <>
      {/* フィルター */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="商品名で検索"
            value={filters.productName}
            onChange={(e) => handleFilterChange('productName', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <select
          value={filters.categoryName}
          onChange={(e) => handleFilterChange('categoryName', e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">すべてのカテゴリー</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">すべての保管場所</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* デスクトップ表示 */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  在庫数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  保管場所
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.product?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.product?.sku}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.product?.category?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.quantity} {item.product?.unit}
                    </div>
                    {item.quantity <= (item.product?.min_stock_level || 0) && (
                      <div className="text-xs text-red-600">
                        在庫が最小在庫数を下回っています
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {item.location || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleAdjustment(item.product_id, 'in')}
                      disabled={adjusting === item.product_id}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      入庫
                    </button>
                    <button
                      onClick={() => handleAdjustment(item.product_id, 'out')}
                      disabled={adjusting === item.product_id}
                      className="text-red-600 hover:text-red-900"
                    >
                      出庫
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* モバイル表示 */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.product?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.product?.sku}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900">
                    {item.quantity} {item.product?.unit}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  カテゴリー: {item.product?.category?.name}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  保管場所: {item.location || '-'}
                </div>
                {item.quantity <= (item.product?.min_stock_level || 0) && (
                  <div className="text-xs text-red-600 mb-2">
                    在庫が最小在庫数を下回っています
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAdjustment(item.product_id, 'in')}
                    disabled={adjusting === item.product_id}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    入庫
                  </button>
                  <button
                    onClick={() => handleAdjustment(item.product_id, 'out')}
                    disabled={adjusting === item.product_id}
                    className="text-red-600 hover:text-red-900"
                  >
                    出庫
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedItem?.type === 'in' ? '入庫' : '出庫'}処理
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItem?.type === 'in' ? '入庫' : '出庫'}する数量を入力してください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <input
              type="number"
              min="1"
              value={selectedItem?.quantity || ''}
              onChange={(e) => setSelectedItem(prev => prev ? {
                ...prev,
                quantity: parseInt(e.target.value) || 0
              } : null)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="数量を入力"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAdjustment}
              disabled={!selectedItem?.quantity}
            >
              確定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 