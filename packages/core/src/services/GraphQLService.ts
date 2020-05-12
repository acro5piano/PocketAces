import { Container, Service } from 'typedi'
import { Schema } from '../schema'
import { Resolver } from '../schema/ResolverRegistry'

@Service()
export class GraphQLService {
  schema = new Schema()

  async buildSchema(schemaString: string) {
    await this.schema.buildSchema(schemaString)
  }

  registerResolver(name: string, resolver: Resolver) {
    this.schema.registerResolver(name, resolver)
  }
}

export default Container.get(GraphQLService)
