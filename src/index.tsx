import { editorMetrics } from "./metrics";
import { definePlugin } from "@tau/plugins";
import { abcExtension } from "./editor/extension";
import { abcCodec } from "./editor/markdown";
import "./styles.css";

declare const __PLUGIN_META__: { id: string; name: string; version: string };

export default definePlugin({
  ...__PLUGIN_META__,
  editorExtensions: [abcExtension],
  editorMetrics,
  editorCodecs: [abcCodec],
});
