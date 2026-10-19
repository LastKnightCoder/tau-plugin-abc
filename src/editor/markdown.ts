import type { EditorMarkdownCodec } from "@tau/plugins";

export const abcCodec: EditorMarkdownCodec = {
  type: "abc",
  isVoid: true,
  fence: { language: "abc" },
  serializer: {
    isBlock: true,
    toMarkdown: (element) => {
      const content = String(element.content ?? "");
      const longest = Math.max(
        0,
        ...(content.match(/`+/g) ?? []).map((run) => run.length),
      );
      const fence = "`".repeat(Math.max(3, longest + 1));
      return `${fence}abc\n${content}\n${fence}`;
    },
  },
};
