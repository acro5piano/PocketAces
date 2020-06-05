import {
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  GraphQLResolveInfo,
} from 'graphql'
import Knex from 'knex'

export interface DirectiveExecutionArgs<
  TValue = any,
  TParent = any,
  TInput extends object = object,
  TContext extends object = object
> {
  currentValue: Knex.QueryBuilder | null | void | TValue
  parentValue: TParent
  resolveInfo: GraphQLResolveInfo
  field: FieldDefinitionNode
  parent: ObjectTypeDefinitionNode
  inputArgs: TInput
  context: TContext
  queryChain: Knex.QueryBuilder
}

export interface DirectiveInit<TArgs extends object> {
  args: TArgs
  db: Knex
}

export type Directive<
  TInitArgs extends object = object,
  TInput extends object = object,
  TValue extends object = object,
  TParent extends object = object,
  TNext = null,
  TContext extends object = object
> = (
  initArgs: DirectiveInit<TInitArgs>,
) => (
  executionArgs: DirectiveExecutionArgs<TValue, TParent, TInput, TContext>,
) => TNext | Promise<void | null | TNext>
