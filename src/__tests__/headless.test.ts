// @vitest-environment node
import { build } from "esbuild";
import vm from "node:vm";
import * as react from "react";
import * as jsx from "react/jsx-runtime";
import { expect, it } from "vitest";

it("完整 CJS 入口无 DOM 求值，纯 codec 和源码回退不执行渲染", async () => {
  const shared = [
    "@tau/plugins",
    "@tau/ui",
    "react",
    "react-dom",
    "react/jsx-runtime",
  ];
  const result = await build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    write: false,
    platform: "browser",
    format: "cjs",
    jsx: "automatic",
    loader: { ".md": "text", ".css": "empty" },
    external: shared,
    define: {
      __PLUGIN_META__: JSON.stringify({
        id: "tau.abc",
        name: "ABC 乐谱",
        version: "0.1.0",
      }),
    },
  });
  const sdk = new Proxy({}, { get: () => (value: unknown) => value });
  const context = {
    module: { exports: {} as any },
    require: (id: string) => {
      if (id === "@tau/plugins") return sdk;
      if (id === "react") return react;
      if (id === "react/jsx-runtime") return jsx;
      if (shared.includes(id)) return {};
      throw new Error("未允许的外部依赖：" + id);
    },
  };
  vm.runInNewContext(result.outputFiles[0].text, context, { timeout: 10_000 });
  const definition = context.module.exports.default;
  expect(definition.editorCodecs[0].type).toBe("abc");
  expect(
    definition.editorExtensions[0].htmlSerializers[0].toHtml({
      content: "<&>",
    }),
  ).toContain("&lt;&amp;&gt;");
});
