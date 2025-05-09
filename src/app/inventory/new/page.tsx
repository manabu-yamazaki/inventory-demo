"use client";

import { ProductForm } from "@/components/inventory/ProductForm";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">新規商品登録</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <ProductForm
            onSuccess={() => {
              router.push("/inventory");
              router.refresh();
            }}
          />
        </div>
      </div>
    </div>
  );
} 