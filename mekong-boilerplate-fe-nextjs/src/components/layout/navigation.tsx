import Link from 'next/link';
import { useNextAuth } from '@/lib/hooks/use-next-auth';
import { RoleBasedUI } from '@/components/auth/role-based-ui';
import { UserRole } from '@/types/auth';

interface NavItem {
  label: string;
  href: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  // Public routes
  { label: 'Home', href: '/' },
  
  // Admin routes
  {
    label: 'Users',
    href: '/admin/users',
    roles: [UserRole.ADMIN]
  },
  {
    label: 'Health',
    href: '/admin/health',
    roles: [UserRole.ADMIN]
  },
  
  // Manager/Member routes
  {
    label: 'Profile',
    href: '/client/profile',
    roles: [UserRole.MANAGER, UserRole.MEMBER, UserRole.ADMIN]
  },
];

export function Navigation() {
  const { user, isAuthenticated, logout } = useNextAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                TikTok Shop
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <RoleBasedUI key={item.href} allowedRoles={item.roles || [UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER]}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    {item.label}
                  </Link>
                </RoleBasedUI>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user?.email}
                  {user && 'role' in user && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                      {user.role as string}
                    </span>
                  )}
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
