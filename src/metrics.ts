import type { EditorMetricRule } from "@tau/plugins";

export const editorMetrics = [
  {
    type: "abc",
    textFields: ["content"],
  },
] as const satisfies readonly EditorMetricRule[];
