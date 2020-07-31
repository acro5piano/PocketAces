import { GraphQLError } from 'graphql'
import { DirectiveProps } from '../contracts/DirectiveContract'

export default async function auth({
  inferredTableName,
  db,
  context,
}: DirectiveProps<{ table?: string }>) {
  if (!context.user || !context.user.uid) {
    // TODO: make this message flexible
    throw new GraphQLError('not_authorized')
  }
  return db.table(inferredTableName).where('id', context.user.uid).first()
}
