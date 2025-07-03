
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from './Header';
import { Sidebar } from './Sidebar';
import { Spinner } from '@/components/ui/spinner';

export const Layout = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
