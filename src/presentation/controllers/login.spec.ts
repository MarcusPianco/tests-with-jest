import { FindUser } from '@/data/ptotocols/find-user'
import { LogonParams, SigninUser } from '@/data/ptotocols/signin-user'
import { UserDto } from '@/data/ptotocols/user-dto'
import { UserModel } from '@/domain/models/user'
import { ValidationError } from '../errors/validation-errors'
import { MissingParamsError } from '../errors/missing-params-error'
import { ServerError } from '../errors/server-error'
import { InvalidParamsError } from '../errors/invalid-params-error'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest } from '../protocols/http'
import { LoginController } from './login'

interface SutTytpes{
  sut: LoginController
  emailvalidatorStub: EmailValidator
  signinUserStub: SigninUser
  findUserStub: FindUser
}
const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFindUser = (): FindUser => {
  class FindUserStub implements FindUser {
    async find (email: string): Promise<UserModel> {
      return Promise.resolve({
        email: 'valid_email@gmail.com',
        id: 'valid_id',
        name: 'valid_name',
        password: 'valid_password'
      })
    }
  }
  return new FindUserStub()
}

const makeSignInStub = (): SigninUser => {
  class SigninUserStub implements SigninUser {
    async logon (params: LogonParams): Promise<UserDto> {
      return Promise.resolve(
        {
          email: 'valid_email',
          id: '1',
          name: 'valid_name',
          password: 'valid_password'

        }
      )
    }
  }
  return new SigninUserStub()
}

const makeSut = (): SutTytpes => {
  const emailvalidatorStub = makeEmailValidatorStub()
  const signinUserStub = makeSignInStub()
  const findUserStub = makeFindUser()
  const sut = new LoginController(emailvalidatorStub,signinUserStub, findUserStub)
  return {
    sut,
    emailvalidatorStub,
    signinUserStub,
    findUserStub
  }
}

describe('LoginController', () => {
  test('should returns badRequest when email not provide',async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })

  test('should returns badRequest when password not ptovide',async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
  test('should returns badRequest when email is invalid',async () => {
    const { sut, emailvalidatorStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'invalid_email',
        password: 'valid_password'
      }
    }
    jest.spyOn(emailvalidatorStub,'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
  })
  test('should returns status code 200 ok when validations passed',async () => {
    const { sut, emailvalidatorStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }
    jest.spyOn(emailvalidatorStub,'isValid').mockReturnValueOnce(true)
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
  })
  test('should returns status code 500 ServErerror if valiadtor throws',async () => {
    const { sut, emailvalidatorStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }
    jest.spyOn(emailvalidatorStub,'isValid').mockImplementationOnce(() => {
      throw new Error('')
    })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('should call logon with correct values',async () => {
    const { sut, signinUserStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }
    const signInSpy = jest.spyOn(signinUserStub,'logon')
    await sut.handle(httpRequest)

    expect(signInSpy).toHaveBeenCalledWith({
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    })
  })
  test('should return statuscode 500 if logon throws',async () => {
    const { sut, signinUserStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }
    jest.spyOn(signinUserStub,'logon').mockResolvedValue(Promise.reject(new Error('')))
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('should return userData if logon success',async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }
    const userSuccessResponse = { email: 'valid_email', id: '1', name: 'valid_name' }
    const { statusCode, body } = await sut.handle(httpRequest)
    const { email,id,name } = body

    expect(statusCode).toBe(200)
    expect({ name,id,email }).toEqual(userSuccessResponse)
  })
  // TODO: refactor -> retornar um erro e não undefined(usernot found)
  test('should return badRequest if user not exist',async () => {
    const { sut, findUserStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }
    jest.spyOn(findUserStub,'find').mockImplementationOnce(() => {
      return undefined
    })
    const { statusCode, body } = await sut.handle(httpRequest)

    expect(statusCode).toBe(400)
    expect(body).toEqual(new ValidationError())
  })
})
