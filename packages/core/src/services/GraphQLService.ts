import { Container, Service } from 'typedi'
import { Schema } from '../schema'

@Service()
export class GraphQLService {
  schema = new Schema()

  async buildSchema(schemaString: string) {
    await this.schema.buildSchema(schemaString)
  }
}

export default Container.get(GraphQLService)
