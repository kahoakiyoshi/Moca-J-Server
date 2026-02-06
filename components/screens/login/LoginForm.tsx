"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/schemas';

interface LoginFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isSubmitting }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  return (
    <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
          メールアドレス
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="example@mail.com"
          {...register('email')}
          disabled={isSubmitting}
          className={`bg-white border-neutral-200 focus:ring-[#3f65b8]/20 focus:border-[#3f65b8] ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
          パスワード
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register('password')}
            disabled={isSubmitting}
            className={`bg-white border-neutral-200 focus:ring-[#3f65b8]/20 focus:border-[#3f65b8] pr-10 ${errors.password ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password.message}</p>}
      </div>

      <Button
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-[#3f65b8] hover:bg-[#345399] text-white h-11 text-base font-medium transition-all shadow-md active:scale-95"
      >
        {isSubmitting ? "ログイン中..." : "ログイン"}
      </Button>
    </form>
  );
};
