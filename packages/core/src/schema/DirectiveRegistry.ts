import { Directive } from '../contracts/DirectiveContract'

import AllDirective from '../directives/AllDirective'
import AuthDirective from '../directives/AuthDirective'
import CanDirective from '../directives/CanDirective'
import CreateDirective from '../directives/CreateDirective'
import HasManyDirective from '../directives/HasManyDirective'
import FindDirective from '../directives/FindDirective'
import LogDirective from '../directives/LogDirective'
import LoginDirective from '../directives/LoginDirective'
import ScopeDirective from '../directives/ScopeDirective'
import UpdateDirective from '../directives/UpdateDirective'
import WhereDirective from '../directives/WhereDirective'

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
