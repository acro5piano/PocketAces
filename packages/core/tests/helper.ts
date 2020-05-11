import anyTest, { TestInterface } from 'ava'
import { Server } from 'http'

export const test = anyTest.serial as TestInterface<{
  server: Server
}>
