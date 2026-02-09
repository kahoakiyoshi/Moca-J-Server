"use client";

import React, { useState } from "react";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
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
import { patientService } from "@/services";
import { usePatients } from "@/hooks/use-patients";
import { Patient } from "@/types";

interface PatientsScreenProps {
  onNavigate: (name: string, params?: any) => void;
}

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SearchFilters {
  id: string;
  searchName: string;
}

import { PatientSearchForm } from "./patients/PatientSearchForm";
import { PatientEditDialog } from "./patients/PatientEditDialog";

const PatientsScreen: React.FC<PatientsScreenProps> = ({ onNavigate }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const initialFilters = {
    id: searchParams.get("id") || "",
    searchName: searchParams.get("searchName") || "",
  };

  const { patients, isLoading, refetch } = usePatients({
    id: initialFilters.id,
    searchName: initialFilters.searchName,
  });

  const onSearchSubmit = (data: SearchFilters) => {
    const params = new URLSearchParams();
    if (data.id) params.set("id", data.id);
    if (data.searchName) params.set("searchName", data.searchName);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  const openEditModal = (patient: Partial<Patient>) => {
    setEditingPatient(patient as Patient);
    setEditModalOpen(true);
  };

  const onSubmit = async (data: Patient) => {
    try {
      await patientService.savePatient(data, !editingPatient?.uid);
      await refetch();
      setEditModalOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "保存に失敗しました");
    }
  };

  const handleDelete = async (uid: string) => {
    if (window.confirm("この患者データを削除してもよろしいですか？")) {
      try {
        await patientService.deletePatient(uid);
        await refetch();
      } catch (error: any) {
        console.error(error);
        alert(error.message || "削除に失敗しました");
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col duration-500">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-light tracking-tight text-neutral-800">患者一覧</h2>
        <Button
          onClick={() => openEditModal({})}
          className="h-10 bg-[#3f65b8] px-6 hover:bg-[#345399]"
        >
          <Plus className="mr-2 h-4 w-4" /> 新規登録
        </Button>
      </div>

      <PatientSearchForm
        initialFilters={initialFilters}
        onSearch={onSearchSubmit}
        onClear={handleClear}
      />

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead className="w-32 font-semibold text-neutral-600">患者ID</TableHead>
              <TableHead className="w-48 font-semibold text-neutral-600">氏名</TableHead>
              <TableHead className="w-24 text-center font-semibold text-neutral-600">
                性別
              </TableHead>
              <TableHead className="w-24 text-center font-semibold text-neutral-600">
                年齢
              </TableHead>
              <TableHead className="w-40 font-semibold text-neutral-600">生年月日</TableHead>
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
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-neutral-400">
                  データがありません
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => {
                const age = new Date().getFullYear() - parseInt(patient.birthYear || "2000");
                return (
                  <TableRow key={patient.uid} className="transition-colors hover:bg-neutral-50/50">
                    <TableCell className="py-4 font-medium text-neutral-700">
                      {patient.id}
                    </TableCell>
                    <TableCell className="py-4 text-neutral-900">
                      {patient.lastName} {patient.firstName}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${patient.gender === "女性" ? "bg-pink-50 text-pink-700" : "bg-blue-50 text-blue-700"}`}
                      >
                        {patient.gender}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-center font-medium text-neutral-600">
                      {age}
                    </TableCell>
                    <TableCell className="py-4 font-mono text-[13px] text-neutral-500">
                      {patient.birthYear}年{patient.birthMonth}月{patient.birthDay}日
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
                          className="animate-in fade-in zoom-in-95 w-36 duration-200"
                        >
                          <DropdownMenuItem
                            onClick={() => onNavigate("testResults", { id: patient.id })}
                            className="cursor-pointer"
                          >
                            検査結果
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditModal(patient)}
                            className="cursor-pointer"
                          >
                            編集
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(patient.uid)}
                            className="cursor-pointer text-red-500 focus:text-red-600"
                          >
                            削除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <PatientEditDialog
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        patient={editingPatient}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default PatientsScreen;
