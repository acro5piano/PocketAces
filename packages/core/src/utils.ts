function truty(a: any) {
  if (Array.isArray(a) && a.length > 0) {
    return true
  }
  if (Object.keys(a).length > 0) {
    return true
  }
  return Boolean(a)
}

export function debug(v: any, cond: any = true) {
  if (truty(cond)) {
    console.log(JSON.stringify(v, undefined, 2))
  }
}
