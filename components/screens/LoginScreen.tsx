"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/schemas';
import { authService } from '@/services';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

interface LoginScreenProps {
  onLogin: () => void;
}

import { LoginForm } from './login/LoginForm';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('このアカウントには管理者権限がありません。');
    }
  }, [searchParams]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await authService.login(data);
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError('メールアドレスまたはパスワードが正しくありません');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-neutral-200 overflow-hidden">
        <CardHeader className="bg-[#3f65b8] text-white p-6">
          <CardTitle className="text-xl font-semibold text-center uppercase tracking-wide">
            ログイン
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pb-0">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium flex items-center gap-2 animate-in fade-in zoom-in-95">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
          <LoginForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </CardContent>
        <CardFooter className="p-8 pt-4 flex flex-col items-center">
          <a href="#" className="text-sm text-[#3f65b8] hover:underline hover:text-[#345399] decoration-2 transition-all font-medium">
            パスワードをお忘れの方はこちら
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
