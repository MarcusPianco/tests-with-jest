import { InvalidParamsError } from '../errors/invalid-params-error'
import { MissingParamsError } from '../errors/missing-params-error'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest } from '../protocols/http'
import { LoginController } from './login'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginController', () => {
  test('should returns badRequest when email not provide',async () => {
    const emailValidatorStub = makeEmailValidatorStub()
    const loginControllerSut = new LoginController(emailValidatorStub)

    const httpRequest: HttpRequest = {
      body: {
        password: 'valid_password'
      }
    }
    const httpResponse = await loginControllerSut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })

  test('should returns badRequest when password not ptovide',async () => {
    const emailValidatorStub = makeEmailValidatorStub()
    const loginControllerSut = new LoginController(emailValidatorStub)

    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email'
      }
    }
    const httpResponse = await loginControllerSut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
  test('should returns badRequest when email is invalid',async () => {
    const emailValidatorStub = makeEmailValidatorStub()
    const loginControllerSut = new LoginController(emailValidatorStub)

    const httpRequest: HttpRequest = {
      body: {
        email: 'invalid_email',
        password: 'valid_password'
      }
    }
    jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
    const httpResponse = await loginControllerSut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
  })
})
