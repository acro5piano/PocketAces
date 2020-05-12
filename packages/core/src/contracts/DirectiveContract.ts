import { ObjectTypeDefinitionNode, FieldDefinitionNode } from 'graphql'

export interface DirectiveContext<TArgs, TValue, TInput> {
  field: FieldDefinitionNode
  parent: ObjectTypeDefinitionNode
  currentValue: TValue
  directiveArgs: TArgs
  inputArgs: TInput
}

// Should we implement this pattern?
// https://github.com/nuwave/lighthouse/blob/master/src/Schema/Values/FieldValue.php
// https://github.com/nuwave/lighthouse/issues/244
export interface DirectiveContract<TArgs = {}, TValue = object, TNext = any, TInput = object> {
  name: string
  resolveField(args: DirectiveContext<TValue, TArgs, TInput>): TNext | Promise<TNext>
}
