"use client";

import { useEffect, useState } from "react";
import { getInventory } from "@/lib/inventory";
import { Inventory } from "@/types/inventory";
import { Loader2 } from "lucide-react";
import { InventoryList } from "@/components/inventory/InventoryList";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-2xl font-bold mb-6">在庫一覧</h1>
      <InventoryList inventory={inventory} onUpdate={() => loadData()} />
    </div>
  );
} 