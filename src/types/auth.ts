export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'dashboard', action: 'read' },
    { resource: 'inventory', action: 'create' },
    { resource: 'inventory', action: 'read' },
    { resource: 'inventory', action: 'update' },
    { resource: 'inventory', action: 'delete' },
    { resource: 'orders', action: 'create' },
    { resource: 'orders', action: 'read' },
    { resource: 'orders', action: 'update' },
    { resource: 'orders', action: 'delete' },
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' },
  ],
  manager: [
    { resource: 'dashboard', action: 'read' },
    { resource: 'inventory', action: 'create' },
    { resource: 'inventory', action: 'read' },
    { resource: 'inventory', action: 'update' },
    { resource: 'orders', action: 'create' },
    { resource: 'orders', action: 'read' },
    { resource: 'orders', action: 'update' },
  ],
  user: [
    { resource: 'dashboard', action: 'read' },
    { resource: 'inventory', action: 'read' },
    { resource: 'orders', action: 'read' },
  ],
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
}; 