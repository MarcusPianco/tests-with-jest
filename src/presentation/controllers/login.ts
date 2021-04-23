import { MissingParamsError } from '../errors/missing-params-error'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest, ok, serverError } from '../helpers/http-helper'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamsError } from '../errors/invalid-params-error'
import { SigninUser } from '@/data/ptotocols/signin-user'
export class LoginController implements Controller {
  private readonly _emailValidator: EmailValidator
  private readonly _signinUser: SigninUser

  constructor (emailValidator: EmailValidator, signinUser: SigninUser) {
    this._emailValidator = emailValidator
    this._signinUser = signinUser
  }

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const fieldsToValidate = ['email', 'password']
    try {
      for (const field of fieldsToValidate) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { email, password } = httpRequest.body
      const emailIsValid = this._emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamsError('email'))
      }
      const logonUserResponse = await this._signinUser.logon({ email,password })

      return ok(logonUserResponse)
    } catch (error) {
      return serverError()
    }
  }
}
