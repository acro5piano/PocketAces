import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      health: {
        type: GraphQLString,
        resolve() {
          return 'ok'
        },
      },
    },
  }),
})
