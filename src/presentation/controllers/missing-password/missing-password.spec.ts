import { UserModel } from '@/domain/models/user'
import { FindUser } from '@/domain/usecases/find-user'
import { MissingPasswordController } from './missing-password'

const makeFindUserStub = (): FindUser => {
  class FindUserStub implements FindUser {
    async find (email: string): Promise<UserModel> {
      return await {
        name: 'valid_name',
        id: 'valid_id',
        email: 'valid_email',
        password: 'valid_password'
      }
    }
  }
  return new FindUserStub()
}

describe('MissingPasswordController', () => {
  test('should called find user with correct data',async () => {
    const findUserUseCase = makeFindUserStub()
    const missingPasswordController = new MissingPasswordController(findUserUseCase)
    const spyFind = jest.spyOn(findUserUseCase,'find')

    const httpRequest = {
      body: {
        email: 'valid_email@email.com'
      }
    }
    await missingPasswordController.handle(httpRequest)
    expect(spyFind).toBeCalledWith('valid_email@email.com')
  })
})
