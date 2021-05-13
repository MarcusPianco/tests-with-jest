import { UserModel } from '@/domain/models/user'
import { FindUser } from '@/domain/usecases/find-user'
import { InvalidParamsError } from '@/presentation/errors/invalid-params-error'
import { MissingParamsError } from '@/presentation/errors/missing-params-error'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import { MissingPasswordController } from './missing-password'

interface SutTypes{
  sut: MissingPasswordController
  findUser: FindUser
  emailValidatorStub: EmailValidator
}
const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
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
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new MissingPasswordController(findUser, emailValidatorStub)
  return {
    sut,
    findUser,
    emailValidatorStub
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

  test('should return badRequest if email is invalid',async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        email: 'invalid_email'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamsError('email'))
  })

  test('should return badRequest if email is not exist in request',async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamsError('email'))
  })
})
