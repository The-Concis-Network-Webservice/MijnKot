"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ value, onChange, placeholder, rows = 6 }: Props) {
  return (
    <textarea
      className="border border-gray-200 rounded-lg px-3 py-2 w-full font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
}
