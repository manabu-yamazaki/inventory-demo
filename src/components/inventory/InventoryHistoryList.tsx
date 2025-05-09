import { InventoryHistory } from '@/types/inventory';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface InventoryHistoryListProps {
  history: InventoryHistory[];
}

export function InventoryHistoryList({ history }: InventoryHistoryListProps) {
  const [filters, setFilters] = useState({
    productName: '',
    categoryName: '',
    operator: '',
  });

  // ユニークなカテゴリー名のリストを取得
  const categories = useMemo(() => {
    const uniqueCategories = new Set(history.map(item => item.product?.category?.name).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [history]);

  // フィルタリングされた履歴
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesProduct = (item.product?.name?.toLowerCase() ?? '').includes(filters.productName.toLowerCase()) ?? true;
      const matchesCategory = !filters.categoryName || item.product?.category?.name === filters.categoryName;
      const matchesOperator = (item.created_by_user?.email?.toLowerCase() ?? '').includes(filters.operator.toLowerCase()) ?? true;
      return matchesProduct && matchesCategory && matchesOperator;
    });
  }, [history, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      {/* フィルター */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
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

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="操作者で検索"
            value={filters.operator}
            onChange={(e) => handleFilterChange('operator', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* デスクトップ表示（テーブル） */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日時
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商品名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カテゴリー
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                変更前
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                変更量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                変更後
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                理由
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredHistory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(item.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.product?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.product?.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.previous_quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`${item.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.quantity_change > 0 ? '+' : ''}{item.quantity_change}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.new_quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.created_by_user?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* モバイル表示（カード） */}
      <div className="md:hidden space-y-4">
        {filteredHistory.map((item) => (
          <div key={item.id} className="bg-white shadow rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">{item.product?.category?.name}</p>
                </div>
                <span className={`text-sm font-medium ${item.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.quantity_change > 0 ? '+' : ''}{item.quantity_change}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">変更前</p>
                  <p className="text-gray-900">{item.previous_quantity}</p>
                </div>
                <div>
                  <p className="text-gray-500">変更後</p>
                  <p className="text-gray-900">{item.new_quantity}</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">操作者</p>
                <p className="text-gray-900">{item.created_by_user?.email}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">理由</p>
                <p className="text-gray-900">{item.reason}</p>
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(item.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 