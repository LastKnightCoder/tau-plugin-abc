import abcjs from "abcjs";

export function renderScore(
  target: HTMLElement,
  content: string,
  foregroundColor: string,
) {
  target.replaceChildren();
  if (!content.trim()) return null;
  const tunes = abcjs.renderAbc(target, content, {
    responsive: "resize",
    foregroundColor,
  });
  const warnings = tunes.flatMap((tune) => tune.warnings ?? []);
  return warnings.length
    ? warnings.map((text) => text.replace(/<[^>]+>/g, "")).join("\n")
    : null;
}

export function sourceHtml(content: string): string {
  const escaped = content.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]!,
  );
  return `<pre class="abc-notation"><code>${escaped}</code></pre>`;
}

export function scoreHtml(element: Record<string, unknown>): string {
  const content = typeof element.content === "string" ? element.content : "";
  if (typeof document === "undefined" || !content.trim())
    return sourceHtml(content);
  const target = document.createElement("div");
  target.style.cssText =
    "position:absolute;left:-9999px;visibility:hidden;width:800px";
  document.body.appendChild(target);
  try {
    renderScore(target, content, "currentColor");
    if (!target.querySelector("svg")) return sourceHtml(content);
    return `<div class="abc-notation">${target.innerHTML}</div>`;
  } catch {
    return sourceHtml(content);
  } finally {
    target.remove();
  }
}
