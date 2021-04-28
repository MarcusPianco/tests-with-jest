import { UserModel } from '@/domain/models/user'

export interface FindUserRepository{
  find: (email: string) => Promise<UserModel>
}
