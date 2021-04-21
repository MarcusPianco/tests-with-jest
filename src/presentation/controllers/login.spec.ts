import { MissingParamsError } from '../errors/missing-params-error'
import { HttpRequest } from '../protocols/http'
import { LoginController } from './login'

describe('LoginController', () => {
  test('should returns badRequest when email not passed',async () => {
    const loginControllerSut = new LoginController()

    const httpRequest: HttpRequest = {
      body: {}
    }
    const httpResponse = await loginControllerSut.handle(httpRequest)

    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })
})
