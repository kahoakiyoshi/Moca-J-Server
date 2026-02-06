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

interface TestItem {
  no: string;
  name: string;
  result: string;
  score: string | number;
  note: string;
  type?: string;
}

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-0 shadow-2xl overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 bg-neutral-50 border-b border-neutral-100">
          <DialogTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Info className="text-[#3f65b8] h-5 w-5" />
            {item?.name}の回答確認
          </DialogTitle>
        </DialogHeader>
        <div className="p-8 space-y-6 bg-white">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">入力の結果</Label>
            <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-5 text-sm font-medium text-neutral-800 shadow-inner whitespace-pre-wrap leading-relaxed min-h-[100px] font-mono">
              {item?.note ? item.note : (item?.type === 'trail_making' ? '1 → あ → 2 → い → 3 → う → 4 → え → 5 → お' : 'データが存在しません')}
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          <div className="grid grid-cols-2 gap-8 px-2">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">判定結果</Label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item?.result === 'OK' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-base font-bold text-neutral-900">{item?.result}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">スコア</Label>
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
