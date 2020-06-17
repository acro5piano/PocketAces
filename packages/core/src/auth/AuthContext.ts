export interface JwtPayload {
  exp: number
  uid: string
  role: string
  iat: number
  type: 'login' | 'refresh'
}

export interface AuthContext {
  user: JwtPayload
}
