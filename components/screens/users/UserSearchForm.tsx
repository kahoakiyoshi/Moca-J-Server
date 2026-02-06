"use client";

import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from 'react-hook-form';

interface UserFilters {
  id: string;
  searchName: string;
}

interface UserSearchFormProps {
  initialFilters: UserFilters;
  onSearch: (data: UserFilters) => void;
  onClear: () => void;
}

export const UserSearchForm: React.FC<UserSearchFormProps> = ({
  initialFilters,
  onSearch,
  onClear,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<UserFilters>({
    defaultValues: initialFilters
  });

  useEffect(() => {
    setValue("id", initialFilters.id);
    setValue("searchName", initialFilters.searchName);
  }, [initialFilters, setValue]);

  return (
    <form onSubmit={handleSubmit(onSearch)}>
      <Card className="mb-8 border-neutral-100 shadow-sm bg-neutral-50/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 uppercase">病院ユーザーID</Label>
              <Input
                placeholder="IDで検索..."
                {...register('id')}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 uppercase">氏名またはメール</Label>
              <Input
                placeholder="名前やメールで検索..."
                {...register('searchName')}
                className="bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClear} className="h-9 px-4 text-neutral-600">
              <X className="mr-2 h-3 w-3" /> クリア
            </Button>
            <Button type="submit" className="bg-[#3f65b8] hover:bg-[#345399] h-9 px-6 shadow-sm">
              <Search className="mr-2 h-3.5 w-3.5" /> 絞り込む
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
