import { Container, Service } from 'typedi'
import { Config as DatabaseConfig } from 'knex'

@Service()
export class ConfigService {
  database!: DatabaseConfig
}

export default Container.get(ConfigService)
