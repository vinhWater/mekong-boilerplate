'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  LogOut,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { useNextAuth } from '@/lib/hooks';

interface ClientSidebarProps extends React.HTMLAttributes<HTMLElement> {
  isMember?: boolean;
  isOpen?: boolean;
}

export function ClientSidebar({ className, isMember = false, isOpen = true }: ClientSidebarProps) {
  const { logout } = useNextAuth();
  const pathname = usePathname();

  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

  // Research section items
  const researchItems = [
    {
      href: '/client/search',
      title: 'Search',
      icon: <Search className="mr-2 h-4 w-4" />,
    },
  ];

  // Settings section items
  const settingsItems = [
    ...(isMember ? [] : [{
      href: '/client/settings',
      title: 'Settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
    }, {
      href: '/client/team',
      title: 'Team',
      icon: <Users className="mr-2 h-4 w-4" />,
    }, {
      href: '/client/billing',
      title: 'Billing',
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    }]),
  ];

  // Render sidebar items with section title
  const renderSidebarSection = (title: string, items: any[]) => (
    <div className="px-2 py-2">
      {/* Section header - hide when collapsed */}
      {isOpen && (
        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-primary/80">
          {title}
        </h2>
      )}
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
              {/* Show title and NEW badge only when expanded */}
              {isOpen && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.isNew && !isActive && (
                    <span className="ml-auto text-[10px] font-bold text-primary">NEW</span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={cn('custom-scrollbar h-full overflow-y-auto pb-12', className)}>
      <div className="space-y-4 py-4">
        {isProduction ? (
          // Production mode - 
          <>
            {renderSidebarSection('Research', researchItems)}
            {renderSidebarSection('Settings', settingsItems)}
          </>
        ) : (
          // Development mode - 
          <>
            {renderSidebarSection('Research', researchItems)}
            {renderSidebarSection('Settings', settingsItems)}
          </>
        )}
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
