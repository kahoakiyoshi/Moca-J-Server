import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date | undefined,
  formatStr: string = "yyyy/MM/dd HH:mm"
) {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}
