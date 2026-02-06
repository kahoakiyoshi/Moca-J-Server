"use client";

import React from 'react';
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
}

export const TestResultItemDialog: React.FC<TestResultItemDialogProps> = ({
  open,
  onOpenChange,
  item,
}) => {

  const renderTest = (item: TestItem | null) => {
    if (!item) return 'データが存在しません';
    switch (item.type) {
      case 'node_test':
        const nodes = JSON.parse(item.note);
        return "入力: " + nodes.join('→');
      case 'drawing_test':
        const paths = JSON.parse(item.note);
        return <svg className='text-9xl' width={"1em"} height={"1em"} viewBox="0 0 300 300">
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
        return item?.note ? <img src={SHAPE_RECALL_IMAGE[JSON.parse(item?.note) as keyof typeof SHAPE_RECALL_IMAGE]} className='w-[100px] h-[100px]' alt="" /> : ''
      case 'shape_match':
        return item?.note ? <img src={SHAPE_MATCHING_IMAGE[JSON.parse(item?.note) as keyof typeof SHAPE_MATCHING_IMAGE]} className='w-[100px] h-[100px]' alt="" /> : ''
      case 'simple_shape_selection':
        if (!item.note) return '';
        try {
          const shapeType = JSON.parse(item.note);
          return renderShape(shapeType);
        } catch (e) {
          return item.note;
        }
      case 'clock_validation':
        return item?.note;
      case 'word_recall':
        return item?.note ? "入力: " + JSON.parse(item?.note)?.join(',') : '';
      case 'sequence_recall':
        const sequence_recall = JSON.parse(item.note) ?? "";
        return "入力: " + sequence_recall?.split("")?.join('→');
      case 'letter_tap_task':
        return item?.note;
      case 'subtraction_task':
        return item?.note;
      case 'sentence_task':
        return item?.note;
      case 'fluency_task':
        return item?.note ? "入力: " + JSON.parse(item?.note)?.join(',') : '';
      case 'similarity_task':
        return "入力: " + item?.note;
      default:
        return item.note ? item.note : 'データが存在しません';
    }
  }

  const renderReference = (item: TestItem | null) => {
    if (!item) return 'データが存在しません';
    switch (item.type) {
      case 'node_test':
        return "自己修復回数: " + item?.repairCount || 0;
      case 'drawing_test':
        return '';
      default:
        return item.note ? item.note : 'データが存在しません';
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

          <div className="grid grid-cols-2 gap-8 px-2">
            <div className="space-y-1">
              <Label className="text-base font-bold text-neutral-400 uppercase tracking-widest">判定結果</Label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item?.result === 'OK' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-base font-bold text-neutral-900">{item?.result}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-base font-bold text-neutral-400 uppercase tracking-widest">スコア</Label>
              <div className="text-2xl font-black text-[#3f65b8] leading-none">
                {item?.score || '0'}<span className="text-sm font-normal text-neutral-400 ml-1">点</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 bg-neutral-50 border-t border-neutral-100">
          <Button onClick={() => onOpenChange(false)} className="w-full bg-neutral-900 hover:bg-black text-white px-8 h-11 font-bold rounded-xl shadow-lg transition-all active:scale-95">
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
