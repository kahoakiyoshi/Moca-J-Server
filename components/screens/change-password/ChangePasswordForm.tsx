"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePasswordSchema } from '@/schemas';

interface ChangePasswordFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit, isSubmitting }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(changePasswordSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">現在のパスワード</Label>
          <div className="relative">
            <Input 
              type={showCurrent ? "text" : "password"} 
              {...register('currentPassword')}
              disabled={isSubmitting}
              className={`pr-10 bg-white border-neutral-200 focus:ring-[#3f65b8]/20 focus:border-[#3f65b8] ${errors.currentPassword ? 'border-red-500' : ''}`}
            />
            <button 
              type="button" 
              onClick={() => setShowCurrent(!showCurrent)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-[10px] text-red-500 font-medium">{errors.currentPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">新しいパスワード</Label>
          <div className="relative">
            <Input 
              type={showNew ? "text" : "password"} 
              {...register('newPassword')}
              disabled={isSubmitting}
              className={`pr-10 bg-white border-neutral-200 focus:ring-[#3f65b8]/20 focus:border-[#3f65b8] ${errors.newPassword ? 'border-red-500' : ''}`}
            />
            <button 
              type="button" 
              onClick={() => setShowNew(!showNew)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-[10px] text-red-500 font-medium">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">新しいパスワード (確認用)</Label>
          <div className="relative">
            <Input 
              type={showConfirm ? "text" : "password"} 
              {...register('confirmPassword')}
              disabled={isSubmitting}
              className={`pr-10 bg-white border-neutral-200 focus:ring-[#3f65b8]/20 focus:border-[#3f65b8] ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button 
              type="button" 
              onClick={() => setShowConfirm(!showConfirm)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-[10px] text-red-500 font-medium">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-[#3f65b8] hover:bg-[#345399] text-white h-11 text-base font-medium shadow-md transition-all active:scale-95">
          {isSubmitting ? "変更中..." : "パスワードを変更する"}
        </Button>
      </div>
    </form>
  );
};
