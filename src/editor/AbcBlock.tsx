import { Music } from "lucide-react";
import {
  SourceBlockEditor,
  useSourceBlock,
  type EditorElementRenderProps,
} from "@tau/plugins";
import { AbcPreview } from "../render/AbcPreview";
import type { AbcElement } from "./types";

export function AbcBlock({
  attributes,
  children,
  element,
}: EditorElementRenderProps<AbcElement>) {
  const { theme } = useSourceBlock(element);
  return (
    <div {...attributes}>
      <SourceBlockEditor
        mode="text"
        title="乐谱"
        icon={Music}
        field="content"
        element={element}
        center
      >
        <AbcPreview
          content={element.content}
          color={theme.token("text") || "currentColor"}
        />
      </SourceBlockEditor>
      {children}
    </div>
  );
}
