"use client";

import { useRef, useState } from "react";

type Props = {
  onUpload: (file: File) => Promise<void>;
  previewUrl?: string | null;
  label?: string;
};

export function ImageUploadZone({ onUpload, previewUrl, label = "Afbeelding uploaden" }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handle = async (file: File) => {
    setUploading(true);
    setProgress(20);
    const tick = setInterval(() => setProgress((p) => Math.min(p + 15, 85)), 300);
    try {
      await onUpload(file);
      setProgress(100);
    } finally {
      clearInterval(tick);
      setTimeout(() => { setUploading(false); setProgress(0); }, 400);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 block">{label}</label>

      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
          dragOver
            ? "border-primary-500 bg-primary-50"
            : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
        }`}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handle(file);
        }}
      >
        {previewUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity bg-black/50 px-3 py-1.5 rounded-lg">
                Vervangen
              </span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-2 pointer-events-none">
            <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 18h16.5M3 3h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3a1.5 1.5 0 01-1.5-1.5V4.5A1.5 1.5 0 013 3z" />
            </svg>
            <p className="text-sm text-gray-500">Sleep een afbeelding of klik om te uploaden</p>
            <p className="text-xs text-gray-400">PNG, JPG, WebP</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
            <div className="w-32 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }}
        />
      </div>
    </div>
  );
}
