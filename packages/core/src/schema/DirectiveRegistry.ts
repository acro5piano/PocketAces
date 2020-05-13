import { Container } from 'typedi'
import { DirectiveContract } from 'src/contracts/DirectiveContract'

import { AllDirective } from 'src/directives/AllDirective'
import { CreateDirective } from 'src/directives/CreateDirective'
import { HasManyDirective } from 'src/directives/HasManyDirective'
import { FindDirective } from 'src/directives/FindDirective'
import { LogDirective } from 'src/directives/LogDirective'
import { WhereDirective } from 'src/directives/WhereDirective'

export class DirectiveRegistry {
  private directives = new Map<string, DirectiveContract>()

  constructor() {
    const builtinDirectives = [
      AllDirective,
      CreateDirective,
      HasManyDirective,
      FindDirective,
      LogDirective,
      WhereDirective,
    ]
    builtinDirectives.forEach(directive => {
      // @ts-ignore
      this.register(Container.get(directive))
    })
  }

  register(directive: DirectiveContract) {
    this.directives.set(directive.name, directive)
  }

  has(name: string) {
    return this.directives.has(name)
  }

  missing(name: string) {
    return !this.has(name)
  }

  get(name: string) {
    const maybeType = this.directives.get(name)
    if (!maybeType) {
      throw new Error(`Directive ${name} does not exist`)
    }
    return maybeType
  }
}
