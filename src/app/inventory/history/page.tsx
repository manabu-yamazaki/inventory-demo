'use client';

import { useEffect, useState } from 'react';
import { InventoryHistory } from '@/types/inventory';
import { getInventoryHistory } from '@/lib/inventory';
import { InventoryHistoryList } from '@/components/inventory/InventoryHistoryList';
import { Loader2 } from 'lucide-react';

export default function InventoryHistoryPage() {
  const [history, setHistory] = useState<InventoryHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getInventoryHistory();
      setHistory(data);
    } catch (error) {
      console.error('履歴データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">入出庫履歴</h1>
      </div>
      <InventoryHistoryList history={history} />
    </div>
  );
} 