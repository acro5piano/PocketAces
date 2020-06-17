import { Inject, Service } from 'typedi'
import { Schema } from 'src/schema'
import { Resolver } from 'src/schema/ResolverRegistry'
import { Directive } from 'src/contracts/DirectiveContract'

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
