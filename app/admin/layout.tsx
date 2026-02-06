"use client";

import React, { useState, useEffect } from 'react';
import { Menu, ArrowLeft, User, ChevronDown, List, FileText, Users, Lock, LogOut } from 'lucide-react';
import SidebarItem from '@/components/layout/SidebarItem';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (isLoading || !isAuthenticated) {
    return <div className="flex h-screen items-center justify-center bg-white text-neutral-400">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-neutral-50 font-sans text-neutral-900 overflow-hidden">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-neutral-500 hover:bg-neutral-100"
          >
            <Menu size={20} />
          </Button>
          <div className="flex items-center gap-3">
            {pathname.includes('/test-results/') && pathname !== '/admin/test-results' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin/test-results')}
                className="h-8 w-8 rounded-full"
              >
                <ArrowLeft size={18} />
              </Button>
            )}
            <h1 className="text-xl font-medium tracking-tight text-neutral-800">病院用コンソール</h1>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 h-11 hover:bg-neutral-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-200 flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[13px] font-bold text-neutral-900 leading-none">{user?.lastName + ' ' + user?.firstName}</p>
                  <p className="text-[11px] text-neutral-500 mt-1 font-medium">{user?.hospitalName}</p>
                </div>
                <ChevronDown size={14} className="text-neutral-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 animate-in fade-in zoom-in-95 duration-200">
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold">{user?.lastName + ' ' + user?.firstName}</span>
                <span className="text-xs text-neutral-500 font-normal mt-1">{user?.role}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigateTo('/admin/change-password')} className="cursor-pointer gap-2 h-10">
              <Lock size={16} className="text-neutral-500" />
              パスワード変更
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 h-10 text-red-600 focus:text-red-700 focus:bg-red-50">
              <LogOut size={16} />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-neutral-200 transition-all duration-300 z-20 flex flex-col justify-between
          ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
      >
        <nav className="mt-4 flex flex-col gap-1">
          <SidebarItem
            label="患者一覧"
            active={pathname === '/admin/patients'}
            onClick={() => navigateTo('/admin/patients')}
            icon={<List size={18} />}
          />
          <SidebarItem
            label="検査結果一覧"
            active={pathname.startsWith('/admin/test-results')}
            onClick={() => navigateTo('/admin/test-results')}
            icon={<FileText size={18} />}
          />
          <SidebarItem
            label="ユーザー管理"
            active={pathname === '/admin/users'}
            onClick={() => navigateTo('/admin/users')}
            icon={<Users size={18} />}
          />
        </nav>
        <div className="p-6 text-[10px] text-neutral-400 font-medium uppercase tracking-widest border-t border-neutral-50">
          © 2026 Moca Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 pt-16 transition-all duration-300 bg-neutral-50/30 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
