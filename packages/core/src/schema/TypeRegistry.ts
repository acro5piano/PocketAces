import { GraphQLType } from 'graphql'

export class TypeRegistry {
  types = new Map<string, GraphQLType>()

  register(name: string, type: GraphQLType) {
    this.types.set(name, type)
  }

  get(name: string): GraphQLType {
    const maybeType = this.types.get(name)
    if (!maybeType) {
      throw new Error(`type ${name} does not exist`)
    }
    return maybeType
  }
}
