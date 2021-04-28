import { MissingParamsError } from '../errors/missing-params-error'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest, ok, serverError } from '../helpers/http-helper'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamsError } from '../errors/invalid-params-error'
import { SigninUser } from '@/data/ptotocols/signin-user'
import { FindUser } from '@/data/ptotocols/find-user'
import { ValidationError } from '../errors/validation-errors'

export class LoginController implements Controller {
  private readonly _emailValidator: EmailValidator
  private readonly _signinUser: SigninUser
  private readonly _findUser: FindUser

  constructor (emailValidator: EmailValidator, signinUser: SigninUser, findUser: FindUser) {
    this._emailValidator = emailValidator
    this._signinUser = signinUser
    this._findUser = findUser
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
      const userExist = await this._findUser.find(email)

      if (!userExist) {
        return badRequest(new ValidationError())
      }
      const logonUserResponse = await this._signinUser.logon({ email,password })

      return ok(logonUserResponse)
    } catch (error) {
      return serverError()
    }
  }
}
