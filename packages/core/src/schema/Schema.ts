import { DatabaseService } from '../services/DatabaseService'
import { typeToTable } from '../database/Convension'
import { Service, Inject } from 'typedi'
import { ReloationLoader } from '../database/ReloationLoader'
import {
  parse,
  graphql,
  printSchema,
  defaultFieldResolver,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  FieldDefinitionNode,
  TypeNode,
  ValueNode,
  ArgumentNode,
  GraphQLType,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLResolveInfo,
} from 'graphql'
import { TypeRegistry } from './TypeRegistry'
import { Resolver, ResolverRegistry } from './ResolverRegistry'
import { DirectiveRegistry } from './DirectiveRegistry'
import { debug } from '../utils'
import { Directive } from '../contracts/DirectiveContract'
import { PrimitiveTypeArray } from '../utils'
import { AuthContext } from '../auth/AuthContext'
import { Request } from 'koa'

type AnyGraphQLFieldConfig = GraphQLFieldConfig<any, any>
type GraphQLContext = Request & AuthContext

function isRootNode(node: ObjectTypeDefinitionNode) {
  return ['Query', 'Mutation', 'Subscription'].includes(node.name.value)
}

interface GraphQLExecutionArgs<V, C> {
  query: string
  variables?: V
  context?: C
}

@Service()
export class Schema {
  @Inject()
  database!: DatabaseService

  @Inject()
  loader!: ReloationLoader

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

  async executeGraphQL<V, C = GraphQLContext>({
    query,
    variables,
    context,
  }: GraphQLExecutionArgs<V, C>) {
    const res = await graphql(this.schema, query, null, context, variables)
    debug(res.errors, !!res.errors)
    debug(res.data, !!res.data)
    return res
  }

  registerResolver(name: string, resolver: Resolver) {
    this.resolverRegistry.register(name, resolver)
  }

  registerDirective(directive: Directive) {
    this.directiveRegistry.register(directive)
  }

  buildSchema(schema: string) {
    const documentNode = parse(schema)

    documentNode.definitions.forEach((definition) => {
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

  private resolveInputObjectFieldFunction(
    definition: InputObjectTypeDefinitionNode,
  ) {
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

  private resolveFieldResolver<
    P extends object = object,
    T extends object = object
  >(parent: ObjectTypeDefinitionNode, field: FieldDefinitionNode) {
    const specifiedResolver = this.resolverRegistry.getOrNull(field.name.value)
    const directiveWithArgs = this.findDirectivesWithArgs(field)

    if (
      isRootNode(parent) &&
      directiveWithArgs.length === 0 &&
      !specifiedResolver
    ) {
      // Since we already know we are on the root type, this is either
      // query, mutation or subscription
      throw new Error(
        `Could not locate a field resolver for the ${parent.name.value}: ${field.name.value}.`,
      )
    }

    if (
      !isRootNode(parent) &&
      directiveWithArgs.length === 0 &&
      !specifiedResolver
    ) {
      return defaultFieldResolver
    }

    return (
      parentValue: P,
      inputArgs: T,
      context: GraphQLContext,
      resolveInfo: GraphQLResolveInfo,
    ) => {
      let value = null
      if (specifiedResolver) {
        value = specifiedResolver(parentValue, null, inputArgs, null as any)
      }

      return directiveWithArgs.reduce(
        (currentValue, { directive, directiveArgs }) => {
          // TODO: make `table` flexible
          const inferredTableName = typeToTable(
            directiveArgs.table,
            resolveInfo.returnType,
          )
          return directive({
            args: directiveArgs,
            db: this.database.db,
            loader: this.loader,
            field,
            parent,
            context,
            inputArgs,
            inferredTableName,
            currentValue,
            resolveInfo,
            parentValue,
            queryChain: currentValue || this.database.db,
          })
        },
        value,
      )
    }
  }

  private findDirectivesWithArgs(field: FieldDefinitionNode) {
    if (!field.directives) {
      return []
    }
    return field.directives.map((directiveNode) => {
      const directive = this.directiveRegistry.get(directiveNode.name.value)

      // TODO:
      //    Here we can't guarantee this code works,
      //    Maybe args handling should be done more proper way.
      const directiveArgs = (directiveNode.arguments || []).reduce(
        (args, arg) => {
          return {
            ...args,
            // @ts-ignore
            [arg.name.value]: this.convertArgumentNodeToJs(arg),
          }
        },
        {},
      ) as any

      return { directive, directiveArgs }
    })
  }

  private convertValueNodeToJs(node: ValueNode): PrimitiveTypeArray {
    if (node.kind === 'Variable' || node.kind === 'ObjectValue') {
      throw new Error(`type note ${node.kind} not supported yet`)
    }
    if (node.kind === 'NullValue') {
      return null
    }
    if (node.kind === 'ListValue') {
      return node.values.map(this.convertValueNodeToJs)
    }
    if (typeof node.value === 'string' || typeof node.value === 'boolean') {
      return node.value
    }
    return (node.value as any).value
  }

  private convertArgumentNodeToJs(node: ArgumentNode) {
    if (node.value.kind === 'ListValue') {
      return node.value.values.map(this.convertValueNodeToJs)
    }
    if (
      node.value.kind === 'StringValue' ||
      node.value.kind === 'IntValue' ||
      node.value.kind === 'FloatValue' ||
      node.value.kind === 'BooleanValue'
    ) {
      return node.value.value
    }
    return this.typeRegistry.get(node.name.value).toString()
    debug(node)
    throw new Error(`${(node as any).kind} cannot be resolved.`)
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
      if (type.name.value === 'Boolean') {
        return GraphQLBoolean
      }
      if (type.name.value === 'Float') {
        return GraphQLFloat
      }
      return this.typeRegistry.get(type.name.value)
    }
    debug(type)
    throw new Error(`${(type as any).kind} cannot be resolved.`)
  }
}
