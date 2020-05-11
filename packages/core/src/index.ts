import { HttpService } from './services/HttpService'
import { Container } from 'typedi'

Container.get(HttpService).initialize().start(3000)
