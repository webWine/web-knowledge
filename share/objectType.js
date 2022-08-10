const _toString = target => Object.prototype.toString.call(target)
export const getType = (obj, type) => _toString(obj) === "[object " + type + "]"