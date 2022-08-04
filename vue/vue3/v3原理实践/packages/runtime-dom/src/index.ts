import { createRenderer } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
const renderOptions = Object.assign(nodeOps, { patchProp });

export function render(vnode: any, container: HTMLElement) {
  createRenderer(renderOptions).render(vnode, container)
}
export * from "@vue/runtime-core"