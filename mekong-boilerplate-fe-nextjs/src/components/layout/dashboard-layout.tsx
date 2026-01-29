'use client';

import './admin-layout.css';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { AdminOnly } from '@/components/auth/role-based-ui';
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, close } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset scroll position when entering Admin Panel
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-close sidebar on mobile when component mounts
  useEffect(() => {
    if (isMobile && isOpen) {
      close();
    }
  }, [isMobile]); // Only run when isMobile changes

  // Handle overlay click
  const handleOverlayClick = () => {
    if (isMobile && isOpen) {
      close();
    }
  };

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }

    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [isMobile, isOpen]);

  return (
    <div className="admin-app flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`border-r transition-all duration-300 ease-in-out ${
            isOpen ? 'w-[200px]' : 'w-[64px]'
          } ${isOpen ? 'sidebar-open' : ''}`}
        >
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out">
          <AdminOnly fallback={
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold">Access Denied</h1>
                <p className="mt-4 text-lg text-gray-600">
                  You do not have permission to access this page.
                </p>
              </div>
            </div>
          }>
            {children}
          </AdminOnly>
        </main>
        
        {/* Overlay backdrop for mobile */}
        {isMobile && (
          <div
            className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
