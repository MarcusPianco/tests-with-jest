import { UserModel } from '@/domain/models/user'
import { FindUser } from '@/domain/usecases/find-user'
import { MissingPasswordController } from './missing-password'

interface SutTypes{
  sut: MissingPasswordController
  findUser: FindUser
}

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

const makeSut = (): SutTypes => {
  const findUser = makeFindUserStub()
  const sut = new MissingPasswordController(findUser)
  return {
    sut,
    findUser
  }
}

describe('MissingPasswordController', () => {
  test('should called find user with correct data',async () => {
    const { sut, findUser } = makeSut()
    const spyFind = jest.spyOn(findUser,'find')

    const httpRequest = {
      body: {
        email: 'valid_email@email.com'
      }
    }
    await sut.handle(httpRequest)
    expect(spyFind).toBeCalledWith('valid_email@email.com')
  })
})
