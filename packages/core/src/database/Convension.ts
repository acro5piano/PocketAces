import pluralize from 'pluralize'

function wash(str: string) {
  return str.replace(/[ \[\]\!]/g, '')
}

export function typeToTable(
  maybeTableName: string | undefined,
  fallback: string | { toString: () => string },
) {
  if (maybeTableName) {
    return maybeTableName
  }
  if (typeof fallback === 'string') {
    return pluralize(wash(fallback.toLowerCase()))
  }
  return pluralize(wash(fallback.toString().toLowerCase()))
}

export function joinKeyFromTable(tableName: string) {
  const withId = `${pluralize.singular(wash(tableName))}Id`
  return withId.slice(0, 1).toLowerCase() + withId.slice(1)
}
