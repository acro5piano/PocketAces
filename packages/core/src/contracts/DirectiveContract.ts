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
  currentValue: Knex.QueryBuilder | null | TValue
  parentValue: TParent
  resolveInfo: GraphQLResolveInfo
  field: FieldDefinitionNode
  parent: ObjectTypeDefinitionNode
  inputArgs: TInput
  context: TContext
}

export interface DirectiveInit<TArgs extends object> {
  args: TArgs
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
) => TNext | Promise<TNext> | void | Promise<void>

// // Should we implement this pattern?
// // https://github.com/nuwave/lighthouse/blob/master/src/Schema/Values/FieldValue.php
// // https://github.com/nuwave/lighthouse/issues/244
// export interface DirectiveContract<
//   TArgs extends object = object,
//   TInput extends object = object,
//   TValue = null,
//   TParent extends object = object,
//   TNext = any,
//   TContext extends object = object
// > {
//   name: string
//   resolveField(
//     args: DirectiveExecutionArgs<TValue, TParent>,
//   ): TNext | Promise<TNext> | void | Promise<void>
//   forge(
//     ctx: Partial<DirectiveParameters<TArgs, TInput, TContext>>,
//   ): DirectiveContract<TArgs, TInput, TValue, TParent, TNext>
//   setParameters(
//     ctx: Partial<DirectiveParameters<TArgs, TInput, TContext>>,
//   ): DirectiveContract<TArgs, TInput, TValue, TParent, TNext>
// }
