import React, { useMemo } from "react";

function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<link[^>]*rel=["']prefetch["'][^>]*>/gi, "")
    .replace(/<next-route-announcer[\s\S]*?<\/next-route-announcer>/gi, "")
    .trim();
}

export default function LegacyHtmlSection({ html, className = "" }) {
  const safeHtml = useMemo(() => sanitizeHtml(html || ""), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}
