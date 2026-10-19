export interface AbcElement {
  type: "abc";
  content: string;
  children: { type: "formatted"; text: string }[];
}

declare module "@tau/plugins" {
  interface EditorElementMap {
    abc: AbcElement;
  }
}
