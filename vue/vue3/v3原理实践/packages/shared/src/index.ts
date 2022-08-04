export function isObject(target: any) {
  return typeof target == "object" && target !== null
}
export function isString(target: any) {
  return typeof target == "string"
}

export function isArray(target: any) {
  return Array.isArray(target)
}
export { ShapeFlags } from "./shapeFlags" 