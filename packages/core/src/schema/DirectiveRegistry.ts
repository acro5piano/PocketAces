import { DirectiveContract } from '../contracts/DirectiveContract'
import { AllDirective } from '../directives/AllDirective'
import { FindDirective } from '../directives/FindDirective'
import { LogDirective } from '../directives/LogDirective'
import { WhereDirective } from '../directives/WhereDirective'
import { Container } from 'typedi'

export class DirectiveRegistry {
  private directives = new Map<string, DirectiveContract>()

  constructor() {
    const builtinDirectives = [AllDirective, FindDirective, LogDirective, WhereDirective]
    builtinDirectives.forEach(directive => {
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
