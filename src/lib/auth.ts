import { User } from '@/types/auth';
import { getUserProfile } from './supabase';
import { supabase } from './supabase/config';


export async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) return null;

  const role = await getUserProfile(user.id);

  return {
    id: user.id,
    email: user.email!,
    role: role?.role ?? 'user',
  };
};

export type UserRole = 'admin' | 'manager' | 'user';

export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('認証が必要です');
  }
  return session;
}

export async function checkRole(allowedRoles: UserRole[]) {
  const session = await checkAuth();

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('ユーザープロファイルが見つかりません');
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    throw new Error('この操作を実行する権限がありません');
  }

  return profile.role as UserRole;
}

export async function checkAdminOrManager() {
  return checkRole(['admin', 'manager']);
}

export async function checkAdmin() {
  return checkRole(['admin']);
} 