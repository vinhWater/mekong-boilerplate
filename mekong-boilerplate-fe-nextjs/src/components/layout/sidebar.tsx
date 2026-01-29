'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  Users,
  Activity,
} from 'lucide-react';
import { useNextAuth } from '@/lib/hooks';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function Sidebar({ className }: React.HTMLAttributes<HTMLElement>) {
  const { logout } = useNextAuth();
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();

  const items = [
    {
      href: '/admin/users',
      title: 'Users',
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: '/admin/health',
      title: 'Redis Health',
      icon: <Activity className="h-4 w-4" />,
    },
  ];

  return (
    <div className={cn('custom-scrollbar h-full overflow-y-auto pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-2 py-2">
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = pathname && (pathname === item.href || pathname.startsWith(`${item.href}/`));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!isOpen ? item.title : undefined} // Tooltip when collapsed
                  className={cn(
                    'flex items-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                    isOpen ? 'px-3 py-2 gap-2' : 'px-0 py-2 justify-center',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                >
                  <span className={cn('shrink-0', !isOpen && 'mx-auto')}>
                    {item.icon}
                  </span>
                  {/* Show title only when expanded */}
                  {isOpen && (
                    <span className="flex-1">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className={cn('px-2', isOpen && 'px-4')}>
        <Button
          variant="outline"
          className={cn(
            'w-full transition-all',
            isOpen ? 'justify-start' : 'justify-center px-0'
          )}
          onClick={logout}
          title={!isOpen ? 'Sign out' : undefined}
        >
          <LogOut className={cn('h-4 w-4', isOpen && 'mr-2')} />
          {isOpen && 'Sign out'}
        </Button>
      </div>
    </div>
  );
}

