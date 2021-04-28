import { UserModel } from '@/domain/models/user'

export interface FindUser{
  find: (email: string) => Promise<UserModel>
}
