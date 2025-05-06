import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ユーザープロファイルを取得する関数
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// ユーザーの権限を取得する関数
export async function getUserPermissions(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;

  const { data: permissions, error: permissionError } = await supabase
    .from('role_permissions')
    .select('permissions(*)')
    .eq('role', profile.role);

  if (permissionError) throw permissionError;

  return permissions.map(p => p.permissions);
}

// ユーザーの権限を更新する関数（管理者のみ）
export async function updateUserRole(userId: string, role: 'admin' | 'manager' | 'user') {
  const { error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw error;
}

// ユーザーが特定の権限を持っているかチェックする関数
export async function checkUserPermission(
  userId: string,
  resource: string,
  action: string
) {
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;

  const { data: permission, error: permissionError } = await supabase
    .from('role_permissions')
    .select('permissions(*)')
    .eq('role', profile.role)
    .eq('permissions.resource', resource)
    .eq('permissions.action', action)
    .single();

  if (permissionError) return false;
  return !!permission;
} 