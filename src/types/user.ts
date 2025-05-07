export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'manager' | 'user';
  created_at: string;
  updated_at: string;
} 