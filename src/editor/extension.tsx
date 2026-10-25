import { Music } from "lucide-react";
import {
  defineEditorElement,
  defineEditorExtension,
  insertSourceBlock,
  sourceBlockParagraphBehavior,
} from "@tau/plugins";
import { AbcBlock } from "./AbcBlock";
import { scoreHtml } from "../render/render";
import type { AbcElement } from "./types";

export const abcExtension = defineEditorExtension({
  id: "tau.abc",
  elements: [
    defineEditorElement<AbcElement>({
      type: "abc",
      dataVersion: 1,
      collaboration: { textFields: ["content"] },
      kind: "block",
      drag: true,
      isVoid: true,
      isEmpty: (element) => !element.content,
      render: (props) => <AbcBlock {...props} />,
    }),
  ],
  blockPanel: [
    {
      icon: Music,
      title: "音乐标注",
      keywords: ["abc", "music", "音乐", "乐谱"],
      description: "ABC 记谱法",
      onClick: (editor) => {
        insertSourceBlock(editor, {
          type: "abc",
          content: "",
          children: [{ type: "formatted", text: "" }],
        });
      },
    },
  ],
  behaviorsFor: { paragraph: sourceBlockParagraphBehavior("abc") },
  htmlSerializers: [{ type: "abc", toHtml: scoreHtml }],
});
