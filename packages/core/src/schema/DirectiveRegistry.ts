import { Directive } from 'src/contracts/DirectiveContract'

import AllDirective from 'src/directives/AllDirective'
import { AuthDirective } from 'src/directives/AuthDirective'
import { CanDirective } from 'src/directives/CanDirective'
import CreateDirective from 'src/directives/CreateDirective'
import { HasManyDirective } from 'src/directives/HasManyDirective'
import FindDirective from 'src/directives/FindDirective'
import { LogDirective } from 'src/directives/LogDirective'
import { LoginDirective } from 'src/directives/LoginDirective'
import ScopeDirective from 'src/directives/ScopeDirective'
import { UpdateDirective } from 'src/directives/UpdateDirective'
import WhereDirective from 'src/directives/WhereDirective'

const builtinDirectives = [
  AllDirective,
  AuthDirective,
  CanDirective,
  CreateDirective,
  HasManyDirective,
  FindDirective,
  LogDirective,
  LoginDirective,
  ScopeDirective,
  UpdateDirective,
  WhereDirective,
]

export class DirectiveRegistry {
  private directives = new Map<string, Directive>()

  constructor() {
    builtinDirectives.forEach((directive) => {
      // @ts-ignore
      this.register(directive)
    })
  }

  register(directive: Directive) {
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
