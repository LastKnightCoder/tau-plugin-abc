import { afterEach, describe, expect, it, vi } from "vitest";
import abcjs from "abcjs";
import { renderScore, scoreHtml } from "../render/render";
import { abcCodec } from "../editor/markdown";

vi.mock("abcjs", () => ({ default: { renderAbc: vi.fn() } }));
const render = vi.mocked(abcjs.renderAbc);
afterEach(() => {
  vi.resetAllMocks();
  document.body.replaceChildren();
});

describe("ABC 渲染与静态导出", () => {
  it("汇总所有曲目的警告并移除 HTML 标签", () => {
    render.mockReturnValue([
      { warnings: ["<b>错误</b>"] },
      { warnings: ["第二首"] },
    ] as any);
    expect(
      renderScore(document.createElement("div"), "X:1\nK:C\nC", "currentColor"),
    ).toBe("错误\n第二首");
  });
  it("清空源码立即移除旧图，不调用渲染器", () => {
    const target = document.createElement("div");
    target.innerHTML = "<svg></svg>";
    expect(renderScore(target, " \n", "currentColor")).toBeNull();
    expect(target.childElementCount).toBe(0);
    expect(render).not.toHaveBeenCalled();
  });
  it("导出 SVG 后移除隐藏容器", () => {
    render.mockImplementation((target) => {
      (target as HTMLElement).innerHTML =
        '<svg viewBox="0 0 400 200"><path d="M0 0"/></svg>';
      return [] as unknown as ReturnType<typeof abcjs.renderAbc>;
    });
    expect(scoreHtml({ content: "X:1\nK:C\nC" })).toContain(
      '<svg viewBox="0 0 400 200">',
    );
    expect(document.body.childElementCount).toBe(0);
  });
  it("渲染异常时导出转义源码并回收容器", () => {
    render.mockImplementation(() => {
      throw new Error("无法渲染");
    });
    expect(scoreHtml({ content: "<script>&\"'</script>" })).toContain(
      "&lt;script&gt;&amp;&quot;&#039;&lt;/script&gt;",
    );
    expect(document.body.childElementCount).toBe(0);
  });
  it("无 SVG 时保留源码", () => {
    render.mockReturnValue([] as unknown as ReturnType<typeof abcjs.renderAbc>);
    expect(scoreHtml({ content: "只有错误源码" })).toContain(
      "<code>只有错误源码</code>",
    );
  });
  it("源码内反引号不截断 Markdown 围栏", () => {
    const node = { type: "abc", content: "% ``` 注释", children: [] };
    expect(abcCodec.serializer!.toMarkdown!(node as any, {} as any)).toBe(
      "````abc\n% ``` 注释\n````",
    );
  });
});
