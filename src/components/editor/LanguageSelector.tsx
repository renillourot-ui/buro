"use client";

import { Select } from "@/components/ui/Controls";
import { EDITOR_LANGUAGES } from "@/data/templates";
import type { CodeLanguage } from "@/types";

const OPTIONS = EDITOR_LANGUAGES.map((id) => ({
  value: id,
  label: id === "javascript" ? "JavaScript" : id === "typescript" ? "TypeScript" : id === "python" ? "Python" : id === "html" ? "HTML" : "CSS",
}));

export function LanguageSelector({
  value,
  onChange,
  className,
  label = "Editor language",
}: {
  value: CodeLanguage;
  onChange: (value: CodeLanguage) => void;
  className?: string;
  label?: string;
}) {
  return (
    <Select
      label={label}
      value={value}
      options={OPTIONS}
      onChange={(v) => onChange(v as CodeLanguage)}
      className={className}
      size="sm"
    />
  );
}
