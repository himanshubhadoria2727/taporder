import React, { useMemo } from "react";
import LegacyHtmlSection from "./LegacyHtmlSection.jsx";
import HeroBanner from "./HeroBanner.jsx";

function extractNavHtml(html) {
  if (typeof window === "undefined" || !html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const navRoot = doc.querySelector(".css-1c1wq7n");

  return navRoot ? navRoot.outerHTML : "";
}

export default function HomeTopSection({ html }) {
  const navHtml = useMemo(() => extractNavHtml(html), [html]);

  return (
    <>
      <LegacyHtmlSection html={navHtml} />
      <HeroBanner />
    </>
  );
}
