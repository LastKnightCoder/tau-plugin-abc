import { Music } from "lucide-react";
import {
  SourceBlockEditor,
  useI18n,
  useSourceBlock,
  type EditorElementRenderProps,
} from "@tau/plugins";
import { AbcPreview } from "../render/AbcPreview";
import { messages } from "../i18n";
import type { AbcElement } from "./types";

export function AbcBlock({
  attributes,
  children,
  element,
}: EditorElementRenderProps<AbcElement>) {
  const { t } = useI18n(messages);
  const { theme } = useSourceBlock(element);
  return (
    <div {...attributes}>
      <SourceBlockEditor
        mode="text"
        title={t("block.title")}
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
