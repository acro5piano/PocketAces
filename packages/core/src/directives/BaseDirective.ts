// import { Container, Service, Inject } from 'typedi'
// import { DatabaseService } from '../services/DatabaseService'
// import { DirectiveContract } from '../contracts/DirectiveContract'
//
// export class BaseDirective implements DirectiveContract {
//   @Inject()
//   database!: DatabaseService
//
//   name = 'all'
//
//   resolveField() {
//     return this.database.db.table('users')
//   }
// }
//
// export default Container.get(AllDirective)
//
