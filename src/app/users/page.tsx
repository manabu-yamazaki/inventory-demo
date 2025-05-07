"use client";

import { useEffect, useState } from "react";
import { UserList } from '@/components/users/UserList';
import { getUserProfileAll } from '@/lib/supabase';
import { UserProfile } from "@/types/user";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // ユーザー一覧の取得
  useEffect(() => {
    const loadData = async () => {
      try {
        const userProfiles = await getUserProfileAll();
        setUsers(userProfiles);

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

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
      <h1 className="text-2xl font-bold mb-6">ユーザー一覧</h1>
      <UserList users={users || []} />
    </div>
  );
} 