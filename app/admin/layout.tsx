"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  ArrowLeft,
  User,
  ChevronDown,
  List,
  FileText,
  Users,
  Lock,
  LogOut,
} from "lucide-react";
import SidebarItem from "@/components/layout/SidebarItem";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
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
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-neutral-400">
        ロード中...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans text-neutral-900">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 shadow-sm">
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
            {pathname.includes("/test-results/") && pathname !== "/admin/test-results" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/admin/test-results")}
                className="h-8 w-8 rounded-full"
              >
                <ArrowLeft size={18} />
              </Button>
            )}
            <h1 className="text-xl font-medium tracking-tight text-neutral-800">
              病院用コンソール
            </h1>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-11 items-center gap-3 pr-4 pl-2 transition-all hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className=""
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-[13px] leading-none font-bold text-neutral-900">
                    {user?.lastName + " " + user?.firstName}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-neutral-500">
                    {user?.hospitalName}
                  </p>
                </div>
                <ChevronDown size={14} className="text-neutral-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="animate-in fade-in zoom-in-95 w-64 p-2 duration-200"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold">{user?.lastName + " " + user?.firstName}</span>
                <span className="mt-1 text-xs font-normal text-neutral-500">{user?.role}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigateTo("/admin/change-password")}
              className="h-10 cursor-pointer gap-2"
            >
              <Lock size={16} className="text-neutral-500" />
              パスワード変更
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="h-10 cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              <LogOut size={16} />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-20 flex flex-col justify-between border-r border-neutral-200 bg-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        <nav className="mt-4 flex flex-col gap-1">
          <SidebarItem
            label="患者一覧"
            active={pathname === "/admin/patients"}
            onClick={() => navigateTo("/admin/patients")}
            icon={<List size={18} />}
          />
          <SidebarItem
            label="検査結果一覧"
            active={pathname.startsWith("/admin/test-results")}
            onClick={() => navigateTo("/admin/test-results")}
            icon={<FileText size={18} />}
          />
          <SidebarItem
            label="ユーザー管理"
            active={pathname === "/admin/users"}
            onClick={() => navigateTo("/admin/users")}
            icon={<Users size={18} />}
          />
        </nav>
        <div className="border-t border-neutral-50 p-6 text-[10px] font-medium tracking-widest text-neutral-400 uppercase">
          © 2026 Moca Admin
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 bg-neutral-50/30 pt-16 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}
      >
        <div
          className={`flex h-full flex-col overflow-y-auto p-8 ${sidebarOpen ? "w-[calc(100vw-256px)]" : "w-[calc(100vw)]"}`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
