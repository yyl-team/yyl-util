/**
 * 创建时间搓 YYYYMMDDhhmmss
 */
export function makeCssJsDate() {
  const now = new Date()
  const addZero = function (num: number) {
    return num < 10 ? `0${num}` : `${num}`
  }
  return (
    now.getFullYear() +
    addZero(now.getMonth() + 1) +
    addZero(now.getDate()) +
    addZero(now.getHours()) +
    addZero(now.getMinutes()) +
    addZero(now.getSeconds())
  )
}
