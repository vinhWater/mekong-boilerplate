'use client';

import { useNextAuth } from '@/lib/hooks/use-next-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Loader2, Menu, PanelLeftClose } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { ActiveJobsIndicator } from '@/components/ui/active-jobs-indicator';
import ThemeToggler from '@/components/Header/ThemeToggler';

export function Header() {
  const { user, isLoading, logout } = useNextAuth();
  const { isOpen, toggle } = useSidebarStore();
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith('/admin');

  return (
    <header className="header sticky top-0 z-40 border-b border-white/10 bg-[#0E0608] h-14 sm:h-16">
      <div className="container flex h-full items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="mr-1 sm:mr-2 h-8 w-8 sm:h-10 sm:w-10 text-white bg-black/40 hover:bg-black/60"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? (
              <PanelLeftClose className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-white">TokExpert</h1>
            </Link>
            <div className="h-3 sm:h-4 w-px bg-white/30"></div>
            <span className="text-base sm:text-lg md:text-xl font-normal text-white/90">
              <span className="inline sm:hidden">{isAdmin ? 'Admin' : 'Seller'}</span>
              <span className="hidden sm:inline">{isAdmin ? 'Admin Center' : 'Seller Center'}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggler />
          <ActiveJobsIndicator />
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled className="h-8 sm:h-10 text-white">
              <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
              <span className="hidden sm:inline">Loading...</span>
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-3 text-white bg-black/40 border-white/20 hover:bg-black/60">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[100px] md:max-w-[150px] truncate">
                    {user.name || user.email || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/client/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild className="h-8 sm:h-9 bg-primary text-white hover:bg-primary/90">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
