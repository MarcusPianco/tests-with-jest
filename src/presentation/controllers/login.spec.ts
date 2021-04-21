import { MissingParamsError } from '../errors/missing-params-error'
import { HttpRequest } from '../protocols/http'
import { LoginController } from './login'

describe('LoginController', () => {
  test('should returns badRequest when email not passed',async () => {
    const loginControllerSut = new LoginController()

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
    const loginControllerSut = new LoginController()

    const httpRequest: HttpRequest = {
      body: {
        email: 'valid_email'
      }
    }
    const httpResponse = await loginControllerSut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
})
