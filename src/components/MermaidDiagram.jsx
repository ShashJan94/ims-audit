import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "default" });

export default function MermaidDiagram({ code }) {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ref.current) return;
      try {
        const id = "mmd-" + Math.random().toString(16).slice(2);
       const safe = (code || "").trim();
const { svg } = await mermaid.render(id, safe);

        if (!cancelled) ref.current.innerHTML = svg;
      } catch (e) {
        if (!cancelled) ref.current.innerHTML = `<pre>${String(e)}</pre>`;
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

  return <div className="card" ref={ref} />;
}
