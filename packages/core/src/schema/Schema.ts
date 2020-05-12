import {
  parse,
  graphql,
  printSchema,
  // isObjectType,
  // isScalarType,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  FieldDefinitionNode,
  TypeNode,
  GraphQLType,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql'
import { TypeRegistry } from './TypeRegistry'
import { debug } from '../utils'

type AnyGraphQLFieldConfig = GraphQLFieldConfig<any, any>

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
        case 'ObjectTypeDefinition':
          this.registerObjectType(definition)
          break
        case 'InputObjectTypeDefinition':
          this.registerInputObjectType(definition)
          break
      }
    })

    this.rawSchema = new GraphQLSchema({
      query: this.typeRegistry.get('Query') as GraphQLObjectType,
      ...(this.typeRegistry.has('Mutation')
        ? { mutation: this.typeRegistry.get('Mutation') as GraphQLObjectType }
        : {}),
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

  private registerInputObjectType(definition: InputObjectTypeDefinitionNode) {
    this.typeRegistry.register(
      definition.name.value,
      new GraphQLInputObjectType({
        name: definition.name.value,
        fields: this.resolveInputObjectFieldFunction(definition),
      }),
    )
  }

  private resolveInputObjectFieldFunction(definition: InputObjectTypeDefinitionNode) {
    return () => {
      if (!definition.fields) {
        return {}
      }

      const fields = definition.fields.reduce((fields, def) => {
        return {
          ...fields,
          [def.name.value]: {
            type: this.resolveDecoratedType(def.type),
          } as AnyGraphQLFieldConfig,
        }
      }, {})
      return fields
    }
  }

  private resolveFieldFunction(definition: ObjectTypeDefinitionNode) {
    return () => {
      if (!definition.fields) {
        return {}
      }

      const fields = definition.fields.reduce((fields, def) => {
        return {
          ...fields,
          [def.name.value]: {
            type: this.resolveDecoratedType(def.type),
            args: this.resolveArguments(def),
            resolve() {
              return 'ok'
            },
          } as AnyGraphQLFieldConfig,
        }
      }, {})
      return fields
    }
  }

  private resolveArguments(definition: FieldDefinitionNode) {
    if (!definition.arguments) {
      return {}
    }

    return definition.arguments.reduce((args, arg) => {
      return {
        ...args,
        [arg.name.value]: {
          type: this.resolveDecoratedType(arg.type),
        },
      }
    }, {})
  }

  private resolveDecoratedType(type: TypeNode): GraphQLType {
    if (type.kind === 'NonNullType') {
      return new GraphQLNonNull(this.resolveDecoratedType(type.type))
    }
    if (type.kind === 'ListType') {
      return new GraphQLList(this.resolveDecoratedType(type.type))
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
      return this.typeRegistry.get(type.name.value)
    }
    debug(type)
    throw new Error(`${(type as any).kind} cannot be resolved.`)
  }
}
