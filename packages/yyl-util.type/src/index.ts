/**
 * 判断类型
 * @param ctx 待判断对象
 */
export function type(ctx: any) {
  let type: string
  const toString = Object.prototype.toString
  if (ctx === null) {
    type = String(ctx)
  } else {
    type = toString.call(ctx).toLowerCase()
    type = type.substring(8, type.length - 1)
  }
  return type
}
