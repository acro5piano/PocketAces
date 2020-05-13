import { ObjectTypeDefinitionNode, FieldDefinitionNode } from 'graphql'

export interface DirectiveExecutionArgs<TValue> {
  currentValue: TValue
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
  TNext = any
> {
  name: string
  resolveField(args: DirectiveExecutionArgs<TValue>): TNext | Promise<TNext> | void | Promise<void>
  forge(
    ctx: Partial<DirectiveContext<TArgs, TInput>>,
  ): DirectiveContract<TArgs, TInput, TValue, TNext>
  setContext(
    ctx: Partial<DirectiveContext<TArgs, TInput>>,
  ): DirectiveContract<TArgs, TInput, TValue, TNext>
}
