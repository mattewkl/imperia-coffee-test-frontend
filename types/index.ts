export interface Credentials {
  username: string
  passphrase: string
}

export interface User {
  name: string
  surname: string
  credentials: Credentials
  active: boolean
  created: string
  _comment: string
} 