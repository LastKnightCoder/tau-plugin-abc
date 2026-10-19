import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import abcjs from "abcjs";
import { AbcPreview } from "../render/AbcPreview";

const report = vi.hoisted(() => vi.fn(() => false));
vi.mock("@tau/plugins", () => ({ useReportPreviewError: report }));
vi.mock("abcjs", () => ({ default: { renderAbc: vi.fn() } }));
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let target: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
async function show(content: string, color = "currentColor") {
  if (!target) {
    target = document.createElement("div");
    document.body.append(target);
    root = createRoot(target);
  }
  await act(async () =>
    root.render(<AbcPreview content={content} color={color} />),
  );
}
afterEach(async () => {
  await act(async () => root?.unmount());
  target?.remove();
  target = undefined as any;
  vi.resetAllMocks();
});

it("源码和主题变化重绘，卸载时回收图形", async () => {
  vi.mocked(abcjs.renderAbc).mockImplementation((target) => {
    (target as HTMLElement).innerHTML = "<svg></svg>";
    return [] as unknown as ReturnType<typeof abcjs.renderAbc>;
  });
  await show("X:1\nK:C\nC", "red");
  await show("X:1\nK:C\nD", "blue");
  expect(abcjs.renderAbc).toHaveBeenLastCalledWith(
    expect.any(HTMLElement),
    "X:1\nK:C\nD",
    expect.objectContaining({ foregroundColor: "blue" }),
  );
  const score = target.querySelector(".tau-abc-preview")!;
  await show("");
  expect(score.childElementCount).toBe(0);
  await show("X:1\nK:C\nE");
  await act(async () => root.unmount());
  expect(score.childElementCount).toBe(0);
});

it("警告不标记旧结果，异常后清图并可恢复", async () => {
  vi.mocked(abcjs.renderAbc).mockReturnValue([
    { warnings: ["<b>警告</b>"] },
  ] as any);
  await show("有警告");
  expect(report).toHaveBeenLastCalledWith("警告", { stale: false });
  vi.mocked(abcjs.renderAbc).mockImplementation(() => {
    throw new Error("语法异常");
  });
  await show("异常");
  expect(target.querySelector('[role="alert"]')?.textContent).toBe("语法异常");
  vi.mocked(abcjs.renderAbc).mockReturnValue(
    [] as unknown as ReturnType<typeof abcjs.renderAbc>,
  );
  await show("修正");
  expect(target.querySelector('[role="alert"]')).toBeNull();
});
