import { UserDto } from './user-dto'

export type LogonParams={
  email: string
  password: string
}

export interface SigninUser{
  logon: (params: LogonParams) => Promise<UserDto>
}
