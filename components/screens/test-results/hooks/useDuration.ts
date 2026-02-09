import { TestItem } from "@/types";
import { useMemo } from "react";

export function useDuration(items: TestItem[]) {
  const totalDuration = useMemo(() => {
    if (!items.length) return "00:00";

    let totalSeconds = 0;
    items.forEach((item) => {
      // Use durationStr or time field
      const timeStr = item.durationStr || item.time || "00:00";
      const parts = timeStr.split(":").map((val: string) => parseInt(val, 10) || 0);

      if (parts.length === 3) {
        // HH:MM:SS
        totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        // MM:SS
        totalSeconds += parts[0] * 60 + parts[1];
      }
    });

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");

    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  }, [items]);

  return totalDuration;
}
