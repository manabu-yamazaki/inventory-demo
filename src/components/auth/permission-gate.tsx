"use client";

import { ReactNode } from 'react';
import { usePermission } from '@/contexts/permission-context';
import { Permission } from '@/types/auth';

interface PermissionGateProps {
  children: ReactNode;
  resource: string;
  action: string;
  fallback?: ReactNode;
}

export function PermissionGate({
  children,
  resource,
  action,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission } = usePermission();

  if (hasPermission(resource, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface AnyPermissionGateProps {
  children: ReactNode;
  permissions: Permission[];
  fallback?: ReactNode;
}

export function AnyPermissionGate({
  children,
  permissions,
  fallback = null,
}: AnyPermissionGateProps) {
  const { hasAnyPermission } = usePermission();

  if (hasAnyPermission(permissions)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface AllPermissionGateProps {
  children: ReactNode;
  permissions: Permission[];
  fallback?: ReactNode;
}

export function AllPermissionGate({
  children,
  permissions,
  fallback = null,
}: AllPermissionGateProps) {
  const { hasAllPermissions } = usePermission();

  if (hasAllPermissions(permissions)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
} 

// // 単一の権限チェック
// <PermissionGate resource="inventory" action="create">
//   <CreateInventoryButton />
// </PermissionGate>

// // 複数の権限のいずれかを持つ場合
// <AnyPermissionGate permissions={[
//   { resource: 'inventory', action: 'create' },
//   { resource: 'inventory', action: 'update' }
// ]}>
//   <InventoryActions />
// </AnyPermissionGate>

// // 全ての権限を持つ場合
// <AllPermissionGate permissions={[
//   { resource: 'inventory', action: 'read' },
//   { resource: 'inventory', action: 'update' }
// ]}>
//   <InventoryManagement />
// </AllPermissionGate>