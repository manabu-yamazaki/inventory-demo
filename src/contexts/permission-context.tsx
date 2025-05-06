"use client";

import { createContext, useContext, ReactNode } from 'react';
import { Permission, rolePermissions } from '@/types/auth';
import { useAuth } from './auth-context';

interface PermissionContextType {
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role];
    return permissions.some(
      (permission) => permission.resource === resource && permission.action === action
    );
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    const userPermissions = rolePermissions[user.role];
    return permissions.some((permission) =>
      userPermissions.some(
        (userPermission) =>
          userPermission.resource === permission.resource &&
          userPermission.action === permission.action
      )
    );
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    const userPermissions = rolePermissions[user.role];
    return permissions.every((permission) =>
      userPermissions.some(
        (userPermission) =>
          userPermission.resource === permission.resource &&
          userPermission.action === permission.action
      )
    );
  };

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
} 