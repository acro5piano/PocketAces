import { Service, Inject } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import { ConfigService } from 'src/services/ConfigService'
import {
  DirectiveExecutionArgs,
  DirectiveParameters,
} from 'src/contracts/DirectiveContract'
import { ReloationLoader } from 'src/database/ReloationLoader'
import { AuthContext } from 'src/auth/AuthContext'
import Knex from 'knex'

@Service()
export class BaseDirective<
  TArgs extends object = object,
  TInput extends object = object,
  TContext extends AuthContext = AuthContext
> {
  private parameters!: DirectiveParameters<TArgs, TInput, TContext>

  resolveField(_args: DirectiveExecutionArgs<any>) {
    throw new Error()
  }

  constructor(
    @Inject() protected readonly database: DatabaseService,
    @Inject() protected readonly config: ConfigService,
    @Inject() protected readonly loader: ReloationLoader,
  ) {}

  forge(
    ctx: Partial<DirectiveParameters<TArgs, TInput, TContext>>,
  ): BaseDirective {
    // @ts-ignore
    const newInstance = new this.constructor(
      this.database,
      this.config,
      this.loader,
    )
    newInstance.setParameters(ctx)
    return newInstance
  }

  setParameters(
    ctx: Partial<DirectiveParameters<TArgs, TInput, TContext>>,
  ): BaseDirective<TArgs, TInput> {
    this.parameters = { ...this.parameters, ...ctx }
    return this
  }

  queryChain(currentValue: Knex.QueryBuilder | null | undefined) {
    if (currentValue) {
      return currentValue
    }
    return (this.database.db as any) as Knex.QueryBuilder
  }

  protected getDirectiveArgValue(name: keyof TArgs) {
    return this.parameters.directiveArgs[name]
  }

  protected getInputArgValue(name: keyof TInput) {
    return this.parameters.inputArgs[name]
  }

  protected getInputArgs() {
    return this.parameters.inputArgs
  }

  protected getDirectiveArgs() {
    return this.parameters.directiveArgs
  }

  protected getCurrentUser() {
    if (!this.parameters.context.user) {
      throw new Error('Not Authorized.')
    }
    return this.parameters.context.user
  }

  protected getParentTypeName() {
    return this.parameters.parent.name.value
  }

  protected get db() {
    return this.database.db
  }
}
