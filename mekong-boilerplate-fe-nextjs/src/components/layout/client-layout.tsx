'use client';

import './client-layout.css';
import { ClientSidebar } from './client-sidebar';
import { Header } from './header';
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/types/auth';
import { useEffect, useState } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isOpen, close } = useSidebarStore();
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  const isMember = session?.user?.role === UserRole.MEMBER;

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset scroll position when entering Seller Center
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
    <div className="client-app flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`border-r transition-all duration-300 ease-in-out ${
            isOpen ? 'w-[200px]' : 'w-[64px]'
          } ${isOpen ? 'sidebar-open' : ''}`}
        >
          <ClientSidebar isMember={isMember} isOpen={isOpen} />
        </aside>
        <main className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
          {children}
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
