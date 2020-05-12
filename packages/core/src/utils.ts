export function debug(v: any, cond = () => true) {
  if (cond()) {
    console.log(JSON.stringify(v, undefined, 2))
  }
}
