"use client";

import { useEffect, useState } from "react";
import { getInventory } from "@/lib/inventory";
import { Inventory } from "@/types/inventory";
import { Loader2, Plus, History } from "lucide-react";
import { InventoryList } from "@/components/inventory/InventoryList";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadData = async () => {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">在庫一覧</h1>
        <div className="flex gap-4">
          <Link
            href="/inventory/history"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <History className="h-5 w-5 mr-2" />
            履歴
          </Link>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Link
              href="/inventory/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              新規登録
            </Link>
          )}
        </div>
      </div>
      <InventoryList inventory={inventory} onUpdate={() => loadData()} />
    </div>
  );
} 