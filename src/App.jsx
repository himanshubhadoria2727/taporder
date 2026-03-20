import React, { useMemo } from "react";

export default function App() {
  const frameSrc = useMemo(() => "/legacy-index.html", []);

  return (
    <iframe
      title="Digital Menu Legacy"
      src={frameSrc}
      style={{ width: "100%", height: "100vh", border: "0", display: "block" }}
    />
  );
}
