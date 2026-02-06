"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, active, onClick, icon }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className={`w-full justify-start h-12 px-4 rounded-none border-l-4 transition-all duration-200
      ${active 
        ? 'bg-neutral-200/50 border-[#3f65b8] text-[#3f65b8] font-bold hover:bg-neutral-200/70' 
        : 'border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      }`}
  >
    {icon && <span className="mr-3">{icon}</span>}
    <span className="text-sm">{label}</span>
  </Button>
);

export default SidebarItem;
