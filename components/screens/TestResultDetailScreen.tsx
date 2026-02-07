"use client";

import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronLeft, Calendar, Clock, Info, Loader2 } from 'lucide-react';
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTestResultDetail } from '@/hooks/use-test-result-detail';
import { testResultService } from '@/services';

interface TestResultDetailScreenProps {
  id: string;
  onBack: () => void;
}

import { TestResultItemDialog } from './test-results/TestResultItemDialog';
import { alls_test } from '@/lib/constants';
import { TestItem } from '@/types';

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

  const handleApprove = async () => {
    if (!testResult) return;
    setIsUpdating(true);
    try {
      await testResultService.updateTestResult(testResult.uid, { approved: true });
      await refetch();
    } catch (error) {
      console.error(error);
      alert('承認に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenConfirm = (item: any) => {
    setSelectedItem(item);
    setConfirmModalOpen(true);
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-400 gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-[#3f65b8]" />
        <p>結果を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-red-100 shadow-sm">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-neutral-800">エラーが発生しました</h3>
        <p className="text-neutral-500 mt-2">{error.message}</p>
        <Button variant="outline" onClick={() => refetch()} className="mt-6">もう一度試す</Button>
        <Button variant="link" onClick={onBack} className="mt-2 block mx-auto">戻る</Button>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-neutral-100 shadow-sm">
        <Info className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
        <h3 className="text-lg font-bold text-neutral-800">データが見つかりませんでした</h3>
        <p className="text-neutral-500 mt-2">ID: <span className="font-mono">{id}</span></p>
        <p className="text-neutral-400 text-sm mt-1">Firestoreに該当するドキュメントが存在しないか、アクセス権限がありません。</p>
        <Button variant="link" onClick={onBack} className="mt-6">検査結果一覧へ戻る</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4 pl-0 text-neutral-500 hover:text-neutral-900 transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" /> 検査結果一覧へ戻る
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-light text-neutral-800 tracking-tight">
              {patient ? `${patient.firstName} ${patient.lastName}` : `患者ID: ${testResult.patientId}`}
            </h2>
            <Badge variant="outline" className="font-mono text-[11px] text-neutral-400 border-neutral-200">UID: {testResult.uid}</Badge>
          </div>
          {patient && (
            <p className="text-neutral-500 text-sm font-medium">
              {new Date().getFullYear() - parseInt(patient.birthYear)}歳 · {patient.gender} · {patient.birthYear}-{patient.birthMonth}-{patient.birthDay}生
              <br />
              最終学歴: {patient.education === '12' ? '高卒' : '高卒より上'}
            </p>
          )}
        </div>
        <Card className="min-w-[200px] border-neutral-100 bg-white shadow-sm">
          <CardHeader className="py-2 bg-neutral-50/50">
            <CardTitle className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Total Score</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl font-bold text-[#3f65b8] tracking-tighter">{testResult.score}/30点</div>
          </CardContent>
        </Card>
      </div>

      {!testResult.approved && (
        <div className="mb-8 w-full bg-[#ff7676] rounded-lg p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-full text-white">
              <AlertTriangle size={24} />
            </div>
            <div className="text-white">
              <h4 className="font-bold text-base leading-tight">検査結果の承認が完了していません。</h4>
              <p className="text-white/90 text-sm mt-1">検査結果の確認が終わりましたら承認ボタンを押させてください。</p>
            </div>
          </div>
          <Button
            onClick={handleApprove}
            disabled={isUpdating}
            className="bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold px-8 h-12 rounded-md shadow-md transition-all active:scale-95"
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : '承認'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-neutral-100 shadow-sm border-l-2 border-l-[#3f65b8]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-neutral-50 p-2 rounded-full text-neutral-400">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">検査実施日時</p>
              <p className="text-sm font-medium text-neutral-700">{formatDate(testResult.created_at)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-100 shadow-sm border-l-2 border-l-emerald-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-neutral-50 p-2 rounded-full text-neutral-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">所要時間</p>
              <p className="text-sm font-bold text-neutral-700">{testResult.duration}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={`shadow-sm border-l-2 ${testResult.approved ? 'bg-emerald-50 border-emerald-100 border-l-emerald-500' : 'bg-amber-50 border-amber-100 border-l-amber-500'}`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={testResult.approved ? 'bg-emerald-100 p-2 rounded-full text-emerald-600' : 'bg-amber-100 p-2 rounded-full text-amber-600'}>
              {testResult.approved ? <Info size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div className="flex-1">
              <p className={`text-[10px] font-bold uppercase ${testResult.approved ? 'text-emerald-600' : 'text-amber-600'}`}>ステータス</p>
              <p className={`text-sm font-bold ${testResult.approved ? 'text-emerald-700' : 'text-amber-700'}`}>
                {testResult.approved ? '承認済' : '承認待ち'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200 shadow-sm w-full">
        <Table className="text-[13px]">
          <TableHeader className="bg-neutral-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 font-bold text-neutral-500 uppercase text-[10px]">No</TableHead>
              <TableHead className="font-bold text-neutral-500 uppercase text-[10px]">検査項目名</TableHead>
              <TableHead className="w-[130px] min-w-[130px] max-w-[130px] text-center font-bold text-neutral-500 uppercase text-[10px]">判定基準</TableHead>
              <TableHead className="hidden lg:table-cell font-bold text-neutral-500 uppercase text-[10px]">判定結果</TableHead>
              <TableHead className="text-center font-bold text-neutral-500 uppercase text-[10px]">自動判定スコア</TableHead>
              <TableHead className="text-center font-bold text-neutral-500 uppercase text-[10px]">スコア</TableHead>
              <TableHead className="text-center font-bold text-neutral-500 uppercase text-[10px]">MoCA-J</TableHead>
              <TableHead className="font-bold text-neutral-500 uppercase text-[10px]">回答時間</TableHead>
              <TableHead className="font-bold text-neutral-500 uppercase text-[10px] w-64">参考情報</TableHead>
              <TableHead className="w-24 text-center">確認/修正</TableHead>
              <TableHead className="w-24 text-center">更新日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: TestItem, idx: number) => {
              console.log(item)
              return (
                <TableRow key={idx} className="hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="font-mono text-neutral-400">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-neutral-800">
                    {alls_test[`${item.taskKey}_${item.questionKey}`]}
                  </TableCell>
                  <TableCell className="text-center whitespace-pre-wrap">
                    {item.judgmentCriteria}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-neutral-400 text-[11px]">{item.isCorrect ? 'OK' : 'NG'}</TableCell>
                  <TableCell className="text-center font-semibold text-neutral-500">{item.autoScore ? item.autoScore : item.score}</TableCell>
                  <TableCell className="text-center font-bold text-neutral-900">{item.score}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-block w-5 h-5 rounded-full text-center leading-5 text-[11px] font-bold`}>
                      {item.mocaJ}
                      {/* '○' or '△' or '×' */}
                    </span>
                  </TableCell>
                  <TableCell className="text-neutral-500 font-medium">{item.durationStr}</TableCell>
                  <TableCell className="max-w-56">
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all">
                      {/* {item.taskKey !== 'node_test' && item.taskKey !== "drawing_test" && (typeof item.value === 'object' ? JSON.stringify(item.value) : item.value)} */}
                      {
                        item.taskKey === 'orientation_task' && (item.questionKey === 'step_7' || item.questionKey === 'step_8') && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all">
                            {item.gpsDetail}
                          </span>
                        )
                      }
                      {
                        item.taskKey === 'node_test' && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all">
                            {typeof item.answer === 'object' ? `自己修復回数: ${item.answer.repairCount}` : ''}
                          </span>
                        )
                      }
                      {
                        item.taskKey == 'orientation_task' && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all">
                            {item.questionKey === 'step_1' ? '端末年: ' : ''}
                            {item.questionKey === 'step_2' ? '端末月: ' : ''}
                            {item.questionKey === 'step_3' ? '端末日: ' : ''}
                            {item.questionKey === 'step_4' ? '端末曜日: ' : ''}
                            {item.questionKey === 'step_5' ? '端末時間: ' : ''}
                            {item.questionKey === 'step_6' ? '端末季節: ' : ''}
                            {typeof item.answer === 'string' ? item.answer && item.answer != 'unknown' ? item.answer : '' : ''}
                          </span>
                        )
                      }
                      {
                        item.taskKey == 'delayed_recall' && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all">
                            正解単語: {typeof item.value === 'string' ? item.value && item.value != 'unknown' ? item.value : '' : ''}
                          </span>
                        )
                      }
                      {
                        item.taskKey == 'fluency_task' && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all">
                            入力: {typeof item.answer === 'object' ? item.answer.join(', ') : ''}
                          </span>
                        )
                      }
                      {
                        item.taskKey == 'letter_tap_task' && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all whitespace-pre-wrap">
                            {item.tapSummary}
                          </span>
                        )
                      }
                      {
                        item.taskKey == 'naming_task' && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all whitespace-pre-wrap">
                            入力内容:{item.answer}
                          </span>
                        )
                      }
                      {
                        item.taskKey == 'word_recall' && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all whitespace-pre-wrap">
                            {typeof item.value === 'string' ? item.value : ''}
                          </span>
                        )
                      }
                      {
                        item.taskKey == 'similarity_task' && (
                          <span className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed break-all whitespace-pre-wrap">
                            入力内容:{item.answer}
                          </span>
                        )
                      }
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenConfirm(item)}
                      className="h-7 px-3 text-[11px] font-bold bg-white hover:bg-neutral-50 border-neutral-200 transition-all active:scale-95"
                    >
                      {item.btn || '確認'}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      <TestResultItemDialog
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        item={selectedItem}
      />
    </div>
  );
};

export default TestResultDetailScreen;
