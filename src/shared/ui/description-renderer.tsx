'use client';

import { useState } from "react";

function buildElements(chunks: string[]) {
  const elements: React.ReactNode[] = [];
  let bullets: string[] = [];
  let inList = false;

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return;
    elements.push(
      <ul key={key} className="mt-3 mb-2 space-y-2.5 pl-1">
        {bullets.map((b, bi) => (
          <li key={bi} className="flex items-start gap-3 text-text-main text-sm leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    );
    bullets = [];
    inList = false;
  };

  chunks.forEach((chunk, i) => {
    const isShort = chunk.length < 55;
    const endsWithColon = chunk.endsWith(':');
    const looksLikeHeading = isShort && !chunk.endsWith('.');

    if (endsWithColon) {
      flushBullets(`flush-${i}`);
      elements.push(
        <p key={i} className="mt-7 mb-1 font-semibold text-text-main text-sm">{chunk}</p>
      );
      inList = true;
    } else if (inList && isShort) {
      bullets.push(chunk);
    } else if (looksLikeHeading && !inList) {
      flushBullets(`flush-${i}`);
      elements.push(
        <h3 key={i} className="mt-8 mb-1 font-semibold text-base text-text-main">{chunk}</h3>
      );
    } else {
      flushBullets(`flush-${i}`);
      elements.push(
        <p key={i} className="mt-5 text-text-main text-sm leading-7">{chunk}</p>
      );
    }
  });
  flushBullets('end');
  return elements;
}

export function DescriptionRenderer({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const chunks = text.split(/\n\n+/).map(c => c.trim()).filter(Boolean);
  const hasMore = chunks.length > 2;
  const visible = expanded ? chunks : chunks.slice(0, 2);

  return (
    <div>
      <div className="space-y-0">{buildElements(visible)}</div>
      {hasMore && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
        >
          {expanded ? '↑ Minder tonen' : 'Lees meer ↓'}
        </button>
      )}
    </div>
  );
}
