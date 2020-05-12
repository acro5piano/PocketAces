import { ObjectTypeDefinitionNode, FieldDefinitionNode } from 'graphql'

export interface DirectiveContext<TOperationArgs, TArgs, TValue> {
  field: FieldDefinitionNode
  parent: ObjectTypeDefinitionNode
  currentValue: TValue
  directiveArgs: TArgs
  operationArgs: TOperationArgs
}

// Should we implement this pattern?
// https://github.com/nuwave/lighthouse/blob/master/src/Schema/Values/FieldValue.php
// https://github.com/nuwave/lighthouse/issues/244
export interface DirectiveContract<
  TArgs = {},
  TValue = object,
  TNext = any,
  TOperationArgs = object
> {
  name: string
  resolveField(args: DirectiveContext<TOperationArgs, TValue, TArgs>): TNext | Promise<TNext>
}
