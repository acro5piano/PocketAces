export interface AuthContext {
  user?: {
    uid: string
    role: string
    iat: number
  }
}
