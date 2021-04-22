import { MissingParamsError } from '../errors/missing-params-error'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest, ok } from '../helpers/http-helper'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamsError } from '../errors/invalid-params-error'
export class LoginController implements Controller {
  private readonly _emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this._emailValidator = emailValidator
  }

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const fieldsToValidate = ['email', 'password']

    for (const field of fieldsToValidate) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }
    const { email } = httpRequest.body
    const emailIsValid = this._emailValidator.isValid(email)

    if (!emailIsValid) {
      return badRequest(new InvalidParamsError('email'))
    }
    return ok('fields validated')
  }
}
