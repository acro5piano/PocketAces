import { ObjectTypeDefinitionNode, FieldDefinitionNode, GraphQLResolveInfo } from 'graphql'
import Knex from 'knex'

export interface DirectiveExecutionArgs<TValue = any, TParent = any> {
  currentValue: TValue
  parentValue: TParent
  resolveInfo: GraphQLResolveInfo
}

export interface DirectiveExecutionChainable<TParent = any> {
  currentValue: Knex | null
  parentValue: TParent
  resolveInfo: GraphQLResolveInfo
}

export interface DirectiveContext<TArgs extends object, TInput extends object> {
  field: FieldDefinitionNode
  parent: ObjectTypeDefinitionNode
  directiveArgs: TArgs
  inputArgs: TInput
}

// Should we implement this pattern?
// https://github.com/nuwave/lighthouse/blob/master/src/Schema/Values/FieldValue.php
// https://github.com/nuwave/lighthouse/issues/244
export interface DirectiveContract<
  TArgs extends object = object,
  TInput extends object = object,
  TValue = null,
  TParent extends object = object,
  TNext = any
> {
  name: string
  resolveField(
    args: DirectiveExecutionArgs<TValue, TParent>,
  ): TNext | Promise<TNext> | void | Promise<void>
  forge(
    ctx: Partial<DirectiveContext<TArgs, TInput>>,
  ): DirectiveContract<TArgs, TInput, TValue, TParent, TNext>
  setContext(
    ctx: Partial<DirectiveContext<TArgs, TInput>>,
  ): DirectiveContract<TArgs, TInput, TValue, TParent, TNext>
}
