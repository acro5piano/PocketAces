import { ObjectTypeDefinitionNode, FieldDefinitionNode } from 'graphql'

export interface DirectiveContext<TArgs, TValue> {
  field: FieldDefinitionNode
  parent: ObjectTypeDefinitionNode
  currentValue: TValue
  directiveArgs: TArgs
}

// Should we implement this pattern?
// https://github.com/nuwave/lighthouse/blob/master/src/Schema/Values/FieldValue.php
// https://github.com/nuwave/lighthouse/issues/244
export interface DirectiveContract<TArgs = {}, TValue = any, TNext = any> {
  name: string
  resolveField(args: DirectiveContext<TValue, TArgs>): TNext | Promise<TNext>
}
