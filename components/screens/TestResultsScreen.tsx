import React, { useState, useEffect } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTestResults } from "@/hooks/use-test-results";

import { formatDate } from "@/lib/utils";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface TestResultsScreenProps {
  onNavigate: (name: string, params?: any) => void;
}

interface TestResultsFilters {
  patientId: string;
  approval: string;
  startDate: string;
  endDate: string;
}

import { TestResultsSearchForm } from "./test-results/TestResultsSearchForm";
import Duration from "./test-results/Duration";
import { TestResult } from "@/types";

const TestResultsScreen: React.FC<TestResultsScreenProps> = ({ onNavigate }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialFilters = {
    patientId: searchParams.get("patientId") || "",
    approval: searchParams.get("approval") || "all",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  };

  const { results, isLoading } = useTestResults({
    patientId: initialFilters.patientId || undefined,
    approved: initialFilters.approval || undefined,
    startDate: initialFilters.startDate || undefined,
    endDate: initialFilters.endDate || undefined,
  });

  const onSearchSubmit = (data: TestResultsFilters) => {
    const params = new URLSearchParams();

    if (data.patientId) params.set("patientId", data.patientId);
    if (data.approval !== "all") params.set("approval", data.approval);
    if (data.startDate) params.set("startDate", data.startDate);
    if (data.endDate) params.set("endDate", data.endDate);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col duration-500">
      <h2 className="mb-8 text-3xl font-light tracking-tight text-neutral-800">検査結果一覧</h2>

      <TestResultsSearchForm
        initialFilters={initialFilters}
        onSearch={onSearchSubmit}
        onClear={handleClear}
      />

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead className="w-48 font-semibold text-neutral-600">患者ID</TableHead>
              <TableHead className="w-48 font-semibold text-neutral-600">検査実施日</TableHead>
              <TableHead className="w-24 pr-6 text-right font-semibold text-neutral-600">
                スコア
              </TableHead>
              <TableHead className="w-32 font-semibold text-neutral-600">所要時間</TableHead>
              <TableHead className="w-24 font-semibold text-neutral-600">承認</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    読み込み中...
                  </div>
                </TableCell>
              </TableRow>
            ) : results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-neutral-400">
                  データがありません
                </TableCell>
              </TableRow>
            ) : (
              results.map((item: TestResult) => (
                <TableRow key={item.uid} className="transition-colors hover:bg-neutral-50/50">
                  <TableCell className="py-4 font-mono text-[13px] text-neutral-500">
                    {item.patientId}
                  </TableCell>
                  <TableCell className="py-4 text-neutral-600">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right font-bold text-neutral-800">
                    {typeof item.score === "number" ? item.score.toFixed(2) : item.score}
                  </TableCell>
                  <TableCell className="py-4 text-neutral-600">
                    <Duration items={item?.result || []} />
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={item.approved ? "outline" : "outline"}
                      className={
                        item.approved
                          ? "border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
                          : "bg-neutral-50 font-medium text-neutral-500"
                      }
                    >
                      {item.approved ? "承認済" : "未承認"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full p-0 hover:bg-neutral-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-neutral-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="animate-in fade-in zoom-in-95 w-40 duration-200"
                      >
                        <DropdownMenuItem
                          onClick={() => onNavigate("testResultDetail", { id: item.uid })}
                          className="cursor-pointer"
                        >
                          検査結果詳細
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TestResultsScreen;
