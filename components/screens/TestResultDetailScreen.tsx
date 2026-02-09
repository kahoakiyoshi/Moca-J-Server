"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, ChevronLeft, Calendar, Clock, Info, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTestResultDetail } from "@/hooks/use-test-result-detail";
import { testResultService } from "@/services";

interface TestResultDetailScreenProps {
  id: string;
  onBack: () => void;
}

import { TestResultItemDialog } from "./test-results/TestResultItemDialog";
import { alls_test } from "@/lib/constants";
import { TestItem } from "@/types";
import { useDuration } from "./test-results/hooks/useDuration";

const TestResultDetailScreen: React.FC<TestResultDetailScreenProps> = ({ id, onBack }) => {
  const { testResult, patient, isLoading, error, refetch } = useTestResultDetail({ id });

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const items = useMemo(() => {
    if (!testResult?.result || !Array.isArray(testResult.result)) return [];

    // Map the result JSON to the table structure
    return testResult.result ?? [];
  }, [testResult]);

  const totalDuration = useDuration(items);

  const handleApprove = async () => {
    if (!testResult) return;
    setIsUpdating(true);
    try {
      await testResultService.updateTestResult(testResult.uid, { approved: true });
      await refetch();
    } catch (error) {
      console.error(error);
      alert("承認に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenConfirm = (item: any) => {
    setSelectedItem(item);
    setConfirmModalOpen(true);
  };

  const handleUpdateItem = async (updatedItem: TestItem) => {
    if (!testResult) return;

    // Create copy of result array and update the specific item
    const updatedResult = items.map((item: TestItem) =>
      item.taskKey === updatedItem.taskKey && item.questionKey === updatedItem.questionKey
        ? updatedItem
        : item
    );

    // Calculate new total score from all items
    const newTotalScore = updatedResult.reduce(
      (sum: number, item: TestItem) => sum + (Number(item.score) || 0),
      0
    );

    try {
      await testResultService.updateTestResult(testResult.uid, {
        result: updatedResult,
        score: newTotalScore,
      });
      setSelectedItem(updatedItem); // Update local selected state to show changes in dialog
      await refetch();
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f65b8]" />
        <p>結果を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-white py-20 text-center shadow-sm">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h3 className="text-lg font-bold text-neutral-800">エラーが発生しました</h3>
        <p className="mt-2">{error.message}</p>
        <Button variant="outline" onClick={() => refetch()} className="mt-6">
          もう一度試す
        </Button>
        <Button variant="link" onClick={onBack} className="mx-auto mt-2 block">
          戻る
        </Button>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="rounded-xl border border-neutral-100 bg-white py-20 text-center shadow-sm">
        <Info className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
        <h3 className="text-lg font-bold text-neutral-800">データが見つかりませんでした</h3>
        <p className="mt-2">
          ID: <span className="font-mono">{id}</span>
        </p>
        <p className="mt-1 text-sm">
          Firestoreに該当するドキュメントが存在しないか、アクセス権限がありません。
        </p>
        <Button variant="link" onClick={onBack} className="mt-6">
          検査結果一覧へ戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-col duration-500">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 pl-0 transition-colors hover:text-neutral-900"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> 検査結果一覧へ戻る
          </Button>
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-3xl font-light tracking-tight text-neutral-800">
              {patient
                ? `${patient.lastName} ${patient.firstName}`
                : `患者ID: ${testResult.patientId}`}
            </h2>
            <Badge variant="outline" className="border-neutral-200 font-mono text-sm">
              UID: {testResult.uid}
            </Badge>
          </div>
          {patient && (
            <p className="text-sm font-medium">
              {new Date().getFullYear() - parseInt(patient.birthYear)}歳 · {patient.gender} ·{" "}
              {patient.birthYear}-{patient.birthMonth}-{patient.birthDay}生
              <br />
              最終学歴: {patient.education === "12" ? "高卒" : "高卒より上"}
            </p>
          )}
        </div>
        <Card className="min-w-[200px] border-neutral-100 bg-white shadow-sm">
          <CardHeader className="bg-neutral-50/50 py-2">
            <CardTitle className="text-sm font-bold tracking-widest uppercase">
              Total Score
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl font-bold tracking-tighter text-[#3f65b8]">
              {testResult.score}/30点
            </div>
          </CardContent>
        </Card>
      </div>

      {!testResult.approved && (
        <div className="animate-in fade-in slide-in-from-top-4 mb-8 flex w-full items-center justify-between rounded-lg bg-[#ff7676] p-4 shadow-sm duration-500">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/20 p-2.5 text-white">
              <AlertTriangle size={24} />
            </div>
            <div className="text-white">
              <h4 className="text-base leading-tight font-bold">
                検査結果の承認が完了していません。
              </h4>
              <p className="mt-1 text-sm text-white/90">
                検査結果の確認が終わりましたら承認ボタンを押させてください。
              </p>
            </div>
          </div>
          <Button
            onClick={handleApprove}
            disabled={isUpdating}
            className="h-12 rounded-md bg-[#1e293b] px-8 font-bold text-white shadow-md transition-all hover:bg-[#0f172a] active:scale-95"
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : "承認"}
          </Button>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-2 border-neutral-100 border-l-[#3f65b8] shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-neutral-50 p-2">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase">検査実施日時</p>
              <p className="text-sm font-medium text-neutral-700">
                {formatDate(testResult.created_at)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-2 border-neutral-100 border-l-emerald-500 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-neutral-50 p-2">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase">所要時間</p>
              <p className="text-sm font-bold text-neutral-700">{totalDuration}</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`border-l-2 shadow-sm ${testResult.approved ? "border-emerald-100 border-l-emerald-500 bg-emerald-50" : "border-amber-100 border-l-amber-500 bg-amber-50"}`}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={
                testResult.approved
                  ? "rounded-full bg-emerald-100 p-2 text-emerald-600"
                  : "rounded-full bg-amber-100 p-2 text-amber-600"
              }
            >
              {testResult.approved ? <Info size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-bold uppercase ${testResult.approved ? "text-emerald-600" : "text-amber-600"}`}
              >
                ステータス
              </p>
              <p
                className={`text-sm font-bold ${testResult.approved ? "text-emerald-700" : "text-amber-700"}`}
              >
                {testResult.approved ? "承認済" : "承認待ち"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full border-neutral-200 shadow-sm">
        <Table className="text-[13px]">
          <TableHeader className="bg-neutral-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-sm font-bold text-neutral-600 uppercase">
                No
              </TableHead>
              <TableHead className="text-sm font-bold text-neutral-600 uppercase">
                検査項目名
              </TableHead>
              <TableHead className="w-[130px] max-w-[130px] min-w-[130px] text-center text-sm font-bold text-neutral-600 uppercase">
                判定基準
              </TableHead>
              <TableHead className="hidden text-sm font-bold text-neutral-600 uppercase lg:table-cell">
                判定結果
              </TableHead>
              <TableHead className="text-center text-sm font-bold text-neutral-600 uppercase">
                自動判定スコア
              </TableHead>
              <TableHead className="text-center text-sm font-bold text-neutral-600 uppercase">
                スコア
              </TableHead>
              <TableHead className="text-center text-sm font-bold text-neutral-600 uppercase">
                MoCA-J
              </TableHead>
              <TableHead className="text-sm font-bold text-neutral-600 uppercase">
                回答時間
              </TableHead>
              <TableHead className="w-64 text-sm font-bold text-neutral-600 uppercase">
                参考情報
              </TableHead>
              <TableHead className="w-24 text-center text-neutral-600">確認/修正</TableHead>
              <TableHead className="w-24 text-center text-neutral-600">更新日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: TestItem, idx: number) => {
              return (
                <TableRow key={idx} className="transition-colors hover:bg-neutral-50/50">
                  <TableCell className="font-mono text-neutral-500">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-neutral-600">
                    {alls_test[`${item.taskKey}_${item.questionKey}`]}
                  </TableCell>
                  <TableCell className="text-center whitespace-pre-wrap text-neutral-500">
                    {item.judgmentCriteria}
                  </TableCell>
                  <TableCell className="hidden text-sm text-neutral-500 lg:table-cell">
                    {item.isCorrect ? "OK" : "NG"}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-neutral-500">
                    {item.score_auto ? item.score_auto : item.score}
                  </TableCell>
                  <TableCell className="text-center font-bold text-neutral-900">
                    {item.score}
                  </TableCell>
                  <TableCell className="text-center text-neutral-500">
                    <span
                      className={`inline-block h-5 w-5 rounded-full text-center text-sm leading-5 font-bold text-neutral-500`}
                    >
                      {item?.taskKey === "orientation_task" &&
                      (item?.questionKey === "step_7" || item?.questionKey === "step_8")
                        ? "△"
                        : item.isCorrect
                          ? "○"
                          : "×"}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-neutral-500">{item.durationStr}</TableCell>
                  <TableCell className="max-w-56 text-neutral-500">
                    <p className="line-clamp-2 text-sm leading-relaxed break-all">
                      {item.taskKey === "node_test" &&
                        (typeof item.value === "object"
                          ? `自己修復回数: ${item.value?.repairCount || 0}`
                          : "")}
                      {item.taskKey === "orientation_task" &&
                        (item.questionKey === "step_7" || item.questionKey === "step_8") && (
                          <span className="line-clamp-2 text-sm leading-relaxed break-all">
                            {item.gpsDetail}
                          </span>
                        )}
                      {item.taskKey === "node_test" && (
                        <span className="line-clamp-2 text-sm leading-relaxed break-all">
                          {typeof item.answer === "object"
                            ? `自己修復回数: ${item.answer.repairCount}`
                            : ""}
                        </span>
                      )}
                      {item.taskKey == "orientation_task" && (
                        <span className="line-clamp-2 text-sm leading-relaxed break-all">
                          {item.questionKey === "step_1" ? "端末年: " : ""}
                          {item.questionKey === "step_2" ? "端末月: " : ""}
                          {item.questionKey === "step_3" ? "端末日: " : ""}
                          {item.questionKey === "step_4" ? "端末曜日: " : ""}
                          {item.questionKey === "step_5" ? "端末時間: " : ""}
                          {item.questionKey === "step_6" ? "端末季節: " : ""}
                          {typeof item.answer === "string"
                            ? item.answer && item.answer != "unknown"
                              ? item.answer
                              : ""
                            : ""}
                        </span>
                      )}
                      {item.taskKey == "delayed_recall" && (
                        <span className="line-clamp-2 text-sm leading-relaxed break-all">
                          正解単語:{" "}
                          {typeof item.value === "string"
                            ? item.value && item.value != "unknown"
                              ? item.value
                              : ""
                            : ""}
                        </span>
                      )}
                      {item.taskKey == "fluency_task" && (
                        <span className="line-clamp-2 text-sm leading-relaxed break-all">
                          入力: {typeof item.answer === "object" ? item.answer.join(", ") : ""}
                        </span>
                      )}
                      {item.taskKey == "letter_tap_task" && (
                        <span className="line-clamp-2 text-sm leading-relaxed break-all whitespace-pre-wrap">
                          {item.tapSummary}
                        </span>
                      )}
                      {item.taskKey == "naming_task" && (
                        <span className="line-clamp-2 text-sm leading-relaxed break-all whitespace-pre-wrap">
                          入力内容:{item.answer}
                        </span>
                      )}
                      {item.taskKey == "word_recall" && (
                        <span className="line-clamp-2 text-sm leading-relaxed break-all whitespace-pre-wrap">
                          {typeof item.value === "string" ? item.value : ""}
                        </span>
                      )}
                      {item.taskKey == "similarity_task" && (
                        <span className="line-clamp-2 text-sm leading-relaxed break-all whitespace-pre-wrap">
                          入力内容:{item.answer}
                        </span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenConfirm(item)}
                      className="h-7 border-neutral-200 bg-white px-3 text-sm font-bold transition-all hover:bg-neutral-50 active:scale-95"
                    >
                      {item.btn || "確認"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <TestResultItemDialog
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        item={selectedItem}
        onUpdate={handleUpdateItem}
      />
    </div>
  );
};

export default TestResultDetailScreen;
