import { Inject, Service } from 'typedi'
import type { Schema } from '../schema'
import { Resolver } from '../schema/ResolverRegistry'
import { Directive } from '../contracts/DirectiveContract'

@Service()
export class GraphQLService {
  @Inject()
  schema!: Schema

  buildSchema = async (schemaString: string) => {
    await this.schema.buildSchema(schemaString)
  }

  registerResolver = (name: string, resolver: Resolver) => {
    this.schema.registerResolver(name, resolver)
  }

  registerDirective = (directive: Directive) => {
    this.schema.registerDirective(directive)
  }
}
