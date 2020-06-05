import boxen from 'boxen'
import dedent from 'dedent'

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

export type PrimitiveType = string | number | boolean | null
export type PrimitiveTypeArray =
  | PrimitiveType[]
  | PrimitiveType
  | PrimitiveTypeArray[]

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const picked: Pick<T, K> = {} as any
  for (const [key, value] of Object.entries(obj)) {
    if (keys.includes(key as any)) {
      Object.assign(picked, { [key]: value })
    }
  }
  return picked
}

export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const picked: Omit<T, K> = {} as any
  for (const [key, value] of Object.entries(obj)) {
    if (!keys.includes(key as any)) {
      Object.assign(picked, { [key]: value })
    }
  }
  return picked
}

export function showBoxMessage(message: any, ...vars: any) {
  console.log(
    boxen(dedent(message, ...vars), {
      padding: 1,
      margin: 1,
      borderColor: 'cyan',
    }),
  )
}
