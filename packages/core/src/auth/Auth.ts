import { compare, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { AuthContext } from 'src/auth/AuthContext'

function getSecret() {
  const maybeSecret = process.env.POCKET_ACE_JWT_SECRET
  if (!maybeSecret) {
    throw new Error('env POCKET_ACE_JWT_SECRET is not defined.')
  }
  return maybeSecret
}

export function createToken(uid: string, role: string | null) {
  return sign({ uid, role }, getSecret())
}

export function getUserFromToken(token: string): AuthContext['user'] {
  return verify(token, getSecret()) as any
}

export function encryptPassowrd(password: string) {
  return hash(password, 10)
}

export function check(password: string, passwordHash: string) {
  return compare(password, passwordHash)
}
