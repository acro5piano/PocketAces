import { compare, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { JwtPayload } from 'src/auth/AuthContext'

export function getSecret() {
  const maybeSecret = process.env.POCKET_ACE_JWT_SECRET
  if (!maybeSecret) {
    throw new Error('env POCKET_ACE_JWT_SECRET is not defined.')
  }
  return maybeSecret
}

const jwtTokenExpiresIn = {
  token: process.env.JWT_TOKEN_TTL || '7days',
  refreshToken: process.env.JWT_TOKEN_TTL || '30days',
}

export function createTokens(uid: string | number, role: string | null) {
  return {
    token: createToken(String(uid), role),
    refreshToken: createRefreshToken(String(uid), role),
  }
}

export function createToken(
  uid: string,
  role: string | null,
  expiresIn: string | number = jwtTokenExpiresIn.token,
) {
  return sign({ uid, role, type: 'login' }, getSecret(), { expiresIn })
}

export function createRefreshToken(
  uid: string,
  role: string | null,
  expiresIn: string | number = jwtTokenExpiresIn.refreshToken,
) {
  return sign({ uid, role, type: 'refresh' }, getSecret(), { expiresIn })
}

export function getUserFromToken(token: string): JwtPayload {
  return verify(token, getSecret()) as any
}

export function encryptPassowrd(password: string) {
  return hash(password, 10)
}

export function check(password: string, passwordHash: string) {
  return compare(password, passwordHash)
}
