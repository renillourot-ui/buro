"use client";

import { SegmentedControl } from "@/components/ui/Controls";
import type { SkillLevel } from "@/types";

const OPTIONS: Array<{ value: SkillLevel; label: string }> = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export function SkillLevelSelector({
  value,
  onChange,
  className,
}: {
  value: SkillLevel;
  onChange: (level: SkillLevel) => void;
  className?: string;
}) {
  return (
    <SegmentedControl
      value={value}
      options={OPTIONS}
      onChange={(v) => onChange(v as SkillLevel)}
      className={className}
      size="sm"
    />
  );
}
