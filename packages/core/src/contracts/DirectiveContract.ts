import {
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  GraphQLResolveInfo,
} from 'graphql'
import Knex from 'knex'

export interface DirectiveExecutionArgs<TValue = any, TParent = any> {
  currentValue: TValue
  parentValue: TParent
  resolveInfo: GraphQLResolveInfo
}

export interface DirectiveExecutionChainable<TParent = any> {
  currentValue: Knex.QueryBuilder | null
  parentValue: TParent
  resolveInfo: GraphQLResolveInfo
}

export interface DirectiveParameters<
  TArgs extends object,
  TInput extends object,
  TContext extends object
> {
  field: FieldDefinitionNode
  parent: ObjectTypeDefinitionNode
  directiveArgs: TArgs
  inputArgs: TInput
  context: TContext
}

// Should we implement this pattern?
// https://github.com/nuwave/lighthouse/blob/master/src/Schema/Values/FieldValue.php
// https://github.com/nuwave/lighthouse/issues/244
export interface DirectiveContract<
  TArgs extends object = object,
  TInput extends object = object,
  TValue = null,
  TParent extends object = object,
  TNext = any,
  TContext extends object = object
> {
  name: string
  resolveField(
    args: DirectiveExecutionArgs<TValue, TParent>,
  ): TNext | Promise<TNext> | void | Promise<void>
  forge(
    ctx: Partial<DirectiveParameters<TArgs, TInput, TContext>>,
  ): DirectiveContract<TArgs, TInput, TValue, TParent, TNext>
  setParameters(
    ctx: Partial<DirectiveParameters<TArgs, TInput, TContext>>,
  ): DirectiveContract<TArgs, TInput, TValue, TParent, TNext>
}
