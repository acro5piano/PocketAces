import { Container, Service } from 'typedi'
import { GraphQLSchema } from 'graphql'

@Service()
export class GraphQLService {
  schema!: GraphQLSchema
}

export default Container.get(GraphQLService)
