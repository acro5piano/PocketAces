import { Service, Inject } from 'typedi'
import { DatabaseService } from '../services/DatabaseService'
import { ConfigService } from '../services/ConfigService'
import { DirectiveExecutionArgs, DirectiveContext } from 'src/contracts/DirectiveContract'

@Service()
export class BaseDirective<TArgs extends object = object, TInput extends object = object> {
  private context!: DirectiveContext<TArgs, TInput>

  resolveField(_args: DirectiveExecutionArgs<any>) {
    throw new Error()
  }

  constructor(
    @Inject() protected readonly database: DatabaseService,
    @Inject() protected readonly config: ConfigService,
  ) {}

  forge(ctx: Partial<DirectiveContext<TArgs, TInput>>): BaseDirective {
    // @ts-ignore
    const newInstance = new this.constructor(this.database, this.config)
    newInstance.setContext(ctx)
    return newInstance
  }

  setContext(ctx: Partial<DirectiveContext<TArgs, TInput>>): BaseDirective<TArgs, TInput> {
    this.context = { ...this.context, ...ctx }
    return this
  }

  protected getDirectiveArgValue(name: keyof TArgs) {
    return this.context.directiveArgs[name]
  }

  protected getInputArgValue(name: keyof TInput) {
    return this.context.inputArgs[name]
  }

  protected getInputArgs() {
    return this.context.inputArgs
  }

  protected db() {
    return this.database.db
  }
}
