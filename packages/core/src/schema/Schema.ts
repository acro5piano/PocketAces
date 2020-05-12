import {
  parse,
  graphql,
  printSchema,
  // isObjectType,
  // isScalarType,
  TypeNode,
  GraphQLType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  ObjectTypeDefinitionNode,
  GraphQLObjectType,
} from 'graphql'
import { TypeRegistry } from './TypeRegistry'

export class Schema {
  private rawSchema?: GraphQLSchema
  private typeRegistry = new TypeRegistry()

  get schema() {
    if (!this.rawSchema) {
      throw new Error('Schema is not defined yet')
    }
    return this.rawSchema
  }

  toString() {
    return printSchema(this.schema)
  }

  executeGraphQL<V>({ query, variables }: { query: string; variables?: V }) {
    return graphql(this.schema, query, variables)
  }

  buildSchema(schema: string) {
    const documentNode = parse(schema)

    documentNode.definitions.forEach(definition => {
      switch (definition.kind) {
        case 'ObjectTypeDefinition': {
          this.registerObjectType(definition)
        }
      }
    })

    this.rawSchema = new GraphQLSchema({
      query: this.typeRegistry.get('Query') as GraphQLObjectType,
    })
  }

  private registerObjectType(definition: ObjectTypeDefinitionNode) {
    this.typeRegistry.register(
      definition.name.value,
      new GraphQLObjectType({
        name: definition.name.value,
        fields: this.resolveFieldFunction(definition),
      }),
    )
  }

  private resolveFieldFunction(definition: ObjectTypeDefinitionNode) {
    return () => {
      if (!definition.fields) {
        return {}
      }

      const fields = definition.fields.reduce((fields, definition) => {
        return {
          ...fields,
          [definition.name.value]: {
            type: this.resolveDecoratedType(definition.type),
            resolve() {
              return 'ok'
            },
          },
        }
      }, {})
      return fields
    }
  }

  private resolveDecoratedType(type: TypeNode): GraphQLType {
    if (type.kind === 'NonNullType') {
      return new GraphQLNonNull(this.resolveDecoratedType(type.type))
    }
    if (type.kind === 'NamedType') {
      if (type.name.value === 'String') {
        return GraphQLString
      }
      if (type.name.value === 'Int') {
        return GraphQLInt
      }
      if (type.name.value === 'ID') {
        return GraphQLID
      }
    }
    throw new Error(`${type.kind} cannot be resolved.`)
  }
}
