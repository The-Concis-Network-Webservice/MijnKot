"use client";

import Markdown from "react-markdown";

interface MarkdownViewProps {
  content: string;
}

/**
 * A client-side wrapper for ReactMarkdown to avoid build issues
 * in server components and Edge runtime.
 */
export default function MarkdownView({ content }: MarkdownViewProps) {
  return <Markdown>{content}</Markdown>;
}
