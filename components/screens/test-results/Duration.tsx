import React from "react";
import { useDuration } from "./hooks/useDuration";
import { TestItem } from "@/types";

export default function Duration({ items }: { items: TestItem[] }) {
  const totalDuration = useDuration(items);
  return <>{totalDuration}</>;
}
