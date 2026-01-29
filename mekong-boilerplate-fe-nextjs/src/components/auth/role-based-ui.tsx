'use client';

import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/types/auth';

interface RoleBasedUIProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders content based on user role
 * 
 * @param children - Content to render if user has allowed role
 * @param allowedRoles - Array of roles that are allowed to view the content
 * @param fallback - Optional content to show if user doesn't have required role
 */
export function RoleBasedUI({ children, allowedRoles, fallback }: RoleBasedUIProps) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  
  // If still loading, don't render anything
  if (isLoading) {
    return null;
  }
  
  // Check if user has required role
  const userRole = session?.user?.role;
  const hasRequiredRole = userRole && allowedRoles.includes(userRole);
  
  // Render children if user has required role, otherwise render fallback
  return hasRequiredRole ? <>{children}</> : (fallback ? <>{fallback}</> : null);
}

/**
 * Component that only renders content for admin users
 */
export function AdminOnly({ children, fallback }: Omit<RoleBasedUIProps, 'allowedRoles'>) {
  return (
    <RoleBasedUI allowedRoles={[UserRole.ADMIN]} fallback={fallback}>
      {children}
    </RoleBasedUI>
  );
}

/**
 * Component that only renders content for manager users
 */
export function ManagerOnly({ children, fallback }: Omit<RoleBasedUIProps, 'allowedRoles'>) {
  return (
    <RoleBasedUI allowedRoles={[UserRole.MANAGER]} fallback={fallback}>
      {children}
    </RoleBasedUI>
  );
}

/**
 * Component that only renders content for member users
 */
export function MemberOnly({ children, fallback }: Omit<RoleBasedUIProps, 'allowedRoles'>) {
  return (
    <RoleBasedUI allowedRoles={[UserRole.MEMBER]} fallback={fallback}>
      {children}
    </RoleBasedUI>
  );
}
