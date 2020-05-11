import { parse } from 'graphql'

export async function parseSchema(schema: any) {
  const parsed = parse(schema)

  return parsed
}
