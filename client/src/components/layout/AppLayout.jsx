import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { QuickTaskModal } from '../tasks/QuickTaskModal';
import { ScrollProgressBar, ScrollToTopButton } from '../common/ScrollEffects';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickTaskOpen, setQuickTaskOpen] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#06110C] text-slate-100 flex selection:bg-[#A31C1B] selection:text-white">
      {/* Top Real-time Scroll Progress Bar */}
      <ScrollProgressBar height={2.5} />

      {/* Ambient background blur orbs */}
      <div className="fixed top-0 right-1/4 -z-10 w-96 h-96 bg-[#A31C1B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 left-1/3 -z-10 w-96 h-96 bg-[#171717]/80 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Topbar
          setMobileOpen={setMobileOpen}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenQuickTask={() => setQuickTaskOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <QuickTaskModal isOpen={quickTaskOpen} onClose={() => setQuickTaskOpen(false)} />

      {/* Floating Scroll to top button */}
      <ScrollToTopButton threshold={300} />
    </div>
  );
}
