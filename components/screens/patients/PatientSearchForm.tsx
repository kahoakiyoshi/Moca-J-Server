"use client";

import React, { useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";

interface SearchFilters {
  id: string;
  searchName: string;
}

interface PatientSearchFormProps {
  initialFilters: SearchFilters;
  onSearch: (data: SearchFilters) => void;
  onClear: () => void;
}

export const PatientSearchForm: React.FC<PatientSearchFormProps> = ({
  initialFilters,
  onSearch,
  onClear,
}) => {
  const { register, handleSubmit, setValue } = useForm<SearchFilters>({
    defaultValues: initialFilters,
  });

  useEffect(() => {
    setValue("id", initialFilters.id);
    setValue("searchName", initialFilters.searchName);
  }, [initialFilters, setValue]);

  return (
    <form onSubmit={handleSubmit(onSearch)}>
      <Card className="mb-8 border-neutral-100 bg-neutral-50/50 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 uppercase">患者ID</Label>
              <Input
                placeholder="IDで検索..."
                {...register("id")}
                className="border-neutral-200 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 uppercase">氏名</Label>
              <Input
                placeholder="名前で検索..."
                {...register("searchName")}
                className="border-neutral-200 bg-white"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClear} className="h-9 px-4">
              <X className="mr-2 h-3 w-3" /> クリア
            </Button>
            <Button type="submit" className="h-9 bg-[#3f65b8] px-6 shadow-sm hover:bg-[#345399]">
              <Search className="h-3.3 mr-2 w-3.5" /> 絞り込む
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
