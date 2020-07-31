import {
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  GraphQLResolveInfo,
} from 'graphql'
import Knex from 'knex'
import { AuthContext } from '../auth/AuthContext'
import { ReloationLoader } from '../database/ReloationLoader'

export interface DirectiveExecutionArgs<
  TArgs = any,
  TValue = any,
  TParent = any,
  TInput extends object = object,
  TContext extends object = object
> {
  args: TArgs
  currentValue: Knex.QueryBuilder | null | void | TValue
  parentValue: TParent
  resolveInfo: GraphQLResolveInfo
  field: FieldDefinitionNode
  parent: ObjectTypeDefinitionNode
  inputArgs: TInput
  inferredTableName: string
  context: TContext
  queryChain: Knex.QueryBuilder
  db: Knex
  loader: ReloationLoader
}

export type Directive<
  TDirectiveArgs extends object = object,
  TInput extends object = object,
  TValue extends object = object,
  TParent extends object = object,
  TNext = null,
  TContext extends object = object
> = (
  args: DirectiveProps<TDirectiveArgs, TInput, TValue, TParent, TContext>,
) => TNext | Promise<void | null | TNext>

export type DirectiveProps<
  TDirectiveArgs extends object = any,
  TInput extends object = any,
  TValue extends object = any,
  TParent extends object = any,
  TContext extends object = AuthContext
> = DirectiveExecutionArgs<TDirectiveArgs, TValue, TParent, TInput, TContext>
