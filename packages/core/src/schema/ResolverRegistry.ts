import { GraphQLFieldResolver, GraphQLTypeResolver } from 'graphql'

export type Resolver =
  | GraphQLFieldResolver<any, any>
  | GraphQLTypeResolver<any, any>

export class ResolverRegistry {
  private resolvers = new Map<string, Resolver>()

  constructor() {
    this.register('ok', () => 'ok')
  }

  register(name: string, type: Resolver) {
    this.resolvers.set(name, type)
  }

  has(name: string) {
    return this.resolvers.has(name)
  }

  missing(name: string) {
    return !this.has(name)
  }

  get(name: string): Resolver {
    const maybeType = this.resolvers.get(name)
    if (!maybeType) {
      throw new Error(`resolver ${name} does not exist`)
    }
    return maybeType
  }

  getOrNull(name: string): Resolver | null {
    return this.resolvers.get(name) || null
  }
}
