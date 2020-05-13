import { GraphQLString, GraphQLObjectType, GraphQLType } from 'graphql'

export class TypeRegistry {
  private types = new Map<string, GraphQLType>()

  constructor() {
    // At least one query is needed to run GraphQL server,
    // so we register it here in case developers don't specify it.
    this.register(
      'Query',
      new GraphQLObjectType({
        name: 'Query',
        fields: {
          health: {
            type: GraphQLString,
            resolve: () => 'ok',
          },
        },
      }),
    )
  }

  register(name: string, type: GraphQLType) {
    this.types.set(name, type)
  }

  has(name: string) {
    return this.types.has(name)
  }

  get(name: string): GraphQLType {
    const maybeType = this.types.get(name)
    if (!maybeType) {
      throw new Error(`type ${name} does not exist`)
    }
    return maybeType
  }
}
