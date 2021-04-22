import { InvalidParamsError } from '../errors/invalid-params-error'
import { MissingParamsError } from '../errors/missing-params-error'
import { ServerError } from '../errors/server-error'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest } from '../protocols/http'
import { LoginController } from './login'

interface SutTytpes{
  sut: LoginController
  emailvalidatorStub: EmailValidator
}
const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTytpes => {
  const emailvalidatorStub = makeEmailValidatorStub()
  const sut = new LoginController(emailvalidatorStub)
  return {
    sut,
    emailvalidatorStub
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
    expect(httpResponse.body).toEqual('fields validated')
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
})
