import {
  parse,
  graphql,
  printSchema,
  defaultFieldResolver,
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
import { Resolver, ResolverRegistry } from './ResolverRegistry'
import { DirectiveRegistry } from './DirectiveRegistry'
import { debug } from '../utils'

type AnyGraphQLFieldConfig = GraphQLFieldConfig<any, any>

function isRootNode(node: ObjectTypeDefinitionNode) {
  return ['Query', 'Mutation', 'Subscription'].includes(node.name.value)
}

export class Schema {
  private rawSchema?: GraphQLSchema
  private typeRegistry = new TypeRegistry()
  private resolverRegistry = new ResolverRegistry()
  private directiveRegistry = new DirectiveRegistry()

  get schema() {
    if (!this.rawSchema) {
      throw new Error('Schema is not defined yet')
    }
    return this.rawSchema
  }

  toString() {
    return printSchema(this.schema)
  }

  async executeGraphQL<V>({ query, variables }: { query: string; variables?: V }) {
    const res = await graphql(this.schema, query, variables)
    if (res.errors) {
      debug(res.errors)
    }
    return res
  }

  registerResolver(name: string, resolver: Resolver) {
    this.resolverRegistry.register(name, resolver)
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
            resolve: this.resolveFieldResolver(definition, def),
          } as AnyGraphQLFieldConfig,
        }
      }, {})
      return fields
    }
  }

  private resolveFieldResolver(parent: ObjectTypeDefinitionNode, field: FieldDefinitionNode) {
    if (isRootNode(parent)) {
      if (this.resolverRegistry.missing(field.name.value)) {
        const directives = this.findDirectives(field)

        if (directives.length > 0) {
          return () =>
            directives.reduce((currentValue, { directiveClass, args }) => {
              return directiveClass.resolveField({
                currentValue,
                field,
                parent,
                directiveArgs: args,
              })
            }, null as any)
        }

        // Since we already know we are on the root type, this is either
        // query, mutation or subscription
        throw new Error(`
Could not locate a field resolver for the ${parent.name.value}: ${field.name.value}.

Either add a resolver directive such as @all, @find or @create or add
a resolver class through:

  schema.register('${field.name.value}', () => 'ok')
        `)
      }

      return this.resolverRegistry.get(field.name.value)
    }
    return defaultFieldResolver
  }

  // TODO:
  //    The return values are { directiveClass: DirectiveContract, args: any }
  //    Because we use DI for directive Class,
  //    but we can create Directive like `new Directive(args)`
  //    consideration is neede here
  private findDirectives(field: FieldDefinitionNode) {
    if (!field.directives) {
      return []
    }
    return field.directives.map(directive => {
      // TODO:
      //    Here we can't guarantee this code works or not.
      //    Maybe args handling should be done more proper way.
      const args = (directive.arguments || []).reduce((args, arg) => {
        return {
          ...args,
          // @ts-ignore
          [arg.name.value]: arg.value.value,
        }
      }, {})

      return {
        args,
        directiveClass: this.directiveRegistry.get(directive.name.value),
      }
    })
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