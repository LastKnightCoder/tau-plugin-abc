import { definePlugin } from "@tau/plugins";
import { abcExtension } from "./editor/extension";
import { abcCodec } from "./editor/markdown";
import content from "./skills/abc.md";
import "./styles.css";

declare const __PLUGIN_META__: { id: string; name: string; version: string };

export default definePlugin({
  ...__PLUGIN_META__,
  editorExtensions: [abcExtension],
  editorCodecs: [abcCodec],
  skills: [
    {
      id: "authoring",
      name: "ABC 乐谱",
      description: "在用户要求编写或修改 ABC 乐谱时使用。",
      content,
    },
  ],
});
