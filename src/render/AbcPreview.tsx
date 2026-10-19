import { useEffect, useRef, useState } from "react";
import { useReportPreviewError } from "@tau/plugins";
import { renderScore } from "./render";

export function AbcPreview({
  content,
  color,
}: {
  content: string;
  color: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const reported = useReportPreviewError(error, { stale: false });
  useEffect(() => {
    const target = container.current;
    if (!target) return;
    try {
      setError(renderScore(target, content, color));
    } catch (reason) {
      target.replaceChildren();
      setError(reason instanceof Error ? reason.message : String(reason));
    }
    return () => target.replaceChildren();
  }, [content, color]);
  return (
    <div data-tau-abc-preview>
      <div ref={container} className="tau-abc-preview" />
      {error && !reported && <p role="alert">{error}</p>}
    </div>
  );
}
