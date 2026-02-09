"use client";

import React from 'react';
import { Info, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { alls_test } from '@/lib/constants';
import { TestItem } from '@/types';
import { SHAPE_MATCHING_IMAGE, SHAPE_RECALL_IMAGE } from './Constant';
import { renderShape } from './Shap';

interface TestResultItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TestItem | null;
  onUpdate?: (updatedItem: TestItem) => void;
}

export const TestResultItemDialog: React.FC<TestResultItemDialogProps> = ({
  open,
  onOpenChange,
  item,
  onUpdate,
}) => {

  console.log(item)

  const renderValue = (val: any) => {
    return typeof val === 'object' ? JSON.stringify(val) : val;
  }
  const renderTest = (item: TestItem | null) => {
    if (!item) return 'データが存在しません';
    const val = item.value;
    switch (item.taskKey) {
      case 'node_test':
        if (typeof val === 'object' && 'ids' in val) {
          return "入力: " + val.ids?.join('→');
        }
        return "入力: " + (typeof val === 'object' ? JSON.stringify(val) : val);
      case 'drawing_test':
        const paths = val as any;
        if (!Array.isArray(paths)) return '';
        return <svg className='text-[300px] w-[300px] h-[300px]' viewBox="0 0 300 300">
          {paths.map((path: any, index: number) => (
            <path
              key={index}
              d={path.path}
              stroke={path.color}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      case 'shape_recall':
        return val ? <img src={SHAPE_RECALL_IMAGE[val as keyof typeof SHAPE_RECALL_IMAGE]} className='w-[100px] h-[100px]' alt="" /> : ''
      case 'shape_match':
        return val ? <img src={SHAPE_MATCHING_IMAGE[val as keyof typeof SHAPE_MATCHING_IMAGE]} className='w-[100px] h-[100px]' alt="" /> : ''
      case 'simple_shape_selection':
        if (!val) return '';
        try {
          const shapeType = val as string;
          return renderShape(shapeType);
        } catch (e) {
          return renderValue(val)
        }
      case 'clock_validation':
        return renderValue(val)
      case 'word_recall':
        return Array.isArray(item?.answer) ? "入力: " + item?.answer.join(',') : renderValue(val)
      case 'sequence_recall':
        const sequence_recall = (typeof val === 'string' ? val : JSON.stringify(val)) ?? "";
        return "入力: " + sequence_recall?.split("")?.join('→');
      case 'subtraction_task':
        return renderValue(val)
      case 'delayed_recall':
        return item?.questionKey === 'free_recall' ? renderValue(val) : "入力: " + item?.answer
      case 'sentence_task':
        return item?.answer;
      case 'letter_tap_task':
        return item?.tapSummary;
      case 'naming_task':
        return "入力: " + (typeof val === 'object' ? JSON.stringify(val) : val);
      case 'fluency_task':
        return Array.isArray(val) ? "入力: " + val.join(',') : renderValue(val)
      case 'similarity_task':
        return "入力: " + (typeof val === 'object' ? JSON.stringify(val) : val);
      case 'orientation_task':
        return "入力: " + (typeof val === 'object' ? JSON.stringify(val) : val);
      default:
        return typeof val === 'object' ? JSON.stringify(val) : (val || 'データが存在しません');
    }
  }

  const renderReference = (item: TestItem | null) => {
    if (!item) return 'データが存在しません';
    switch (item.taskKey) {
      case 'clock_validation':
        return '';
      case 'subtraction_task':
        return '';
      case 'shape_recall':
        return '';
      case 'shape_match':
        return '';
      case 'simple_shape_selection':
        return '';
      case 'naming_task':
        return '';
      case 'word_recall':
        return '';
      case 'sequence_recall':
        return '';
      case 'sentence_task':
        return '';
      case 'similarity_task':
        return '';
      case 'delayed_recall':
        return '';
      case 'orientation_task':
        return <>
          <span className="leading-relaxed break-all">
            {item.questionKey === 'step_1' ? '端末年: ' : ''}
            {item.questionKey === 'step_2' ? '端末月: ' : ''}
            {item.questionKey === 'step_3' ? '端末日: ' : ''}
            {item.questionKey === 'step_4' ? '端末曜日: ' : ''}
            {item.questionKey === 'step_5' ? '端末時間: ' : ''}
            {item.questionKey === 'step_6' ? '端末季節: ' : ''}
            {!(item.questionKey === 'step_7' || item.questionKey === 'step_8') && typeof item.answer === 'string' ? item.answer && item.answer != 'unknown' ? item.answer : '' : ''}
            {
              (item.questionKey === 'step_7' || item.questionKey === 'step_8') && (
                <span className="leading-relaxed break-all">
                  {item.gpsDetail}
                </span>
              )
            }
          </span>
        </>;
      case 'node_test':
        return "自己修復回数: " + (item?.repairCount || 0);
      case 'letter_tap_task':
        return item?.tapSummary;
      case 'drawing_test':
        return '';
      default:
        return typeof item.value === 'object' ? JSON.stringify(item.value) : (item.value || 'データが存在しません');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-0 shadow-2xl overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 bg-neutral-50 border-b border-neutral-100">
          <DialogTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Info className="text-[#3f65b8] h-5 w-5" />
            {alls_test[`${item?.name}_${item?.no}`]}の回答確認
          </DialogTitle>
        </DialogHeader>
        <div className="px-8 space-y-6 bg-white">
          <div className="space-y-3">
            <Label className="text-base font-bold text-neutral-400 uppercase tracking-widest">入力の結果</Label>
            <div className="flex justify-center items-center bg-neutral-50 border border-neutral-500 rounded-xl p-5 text-sm font-medium text-neutral-800 shadow-inner whitespace-pre-wrap leading-relaxed min-h-[10px] font-mono">
              {renderTest(item)}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-base font-bold text-neutral-400 uppercase tracking-widest">参考情報</Label>
            <div className="flex justify-center items-center bg-neutral-50 border border-neutral-500 rounded-xl p-5 text-sm font-medium text-neutral-800 shadow-inner whitespace-pre-wrap leading-relaxed min-h-[10px] font-mono">
              {renderReference(item)}
            </div>
          </div>

          <Separator className="bg-neutral-100 mb-5" />

          <div className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold text-neutral-400 uppercase tracking-widest">判定の修正</Label>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#3f65b8]">{item?.score || '0'}</span>
                <span className="text-xs font-bold text-neutral-400">点</span>
              </div>
            </div>

            <Select
              value={item?.isCorrect === true ? "true" : "false"}
              onValueChange={(val) => {
                if (!item || !onUpdate) return;
                const isCorrect = val === "true";
                if (item.isCorrect === isCorrect) return;

                const currentScore = Number(item.score) || 0;
                const newScore = isCorrect ? currentScore + 1 : Math.max(0, currentScore - 1);

                onUpdate({
                  ...item,
                  isCorrect: isCorrect,
                  score: newScore
                });
              }}
            >
              <SelectTrigger className="w-full h-12 bg-neutral-50 border-neutral-200 rounded-xl font-bold">
                <SelectValue placeholder="判定を選択" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-neutral-200 shadow-xl">
                <SelectItem value="true" className="focus:bg-emerald-50 focus:text-emerald-700 py-3 font-bold cursor-pointer">
                  OK
                </SelectItem>
                <SelectItem value="false" className="focus:bg-red-50 focus:text-red-700 py-3 font-bold cursor-pointer">
                  NG
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="p-6 bg-neutral-50 border-t border-neutral-100">
          <Button onClick={() => onOpenChange(false)} className="w-full hover:bg-black text-white px-8 h-11 font-bold rounded-xl shadow-lg transition-all active:scale-95">
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
