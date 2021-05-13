import { FindUser } from '@/domain/usecases/find-user'
import { InvalidParamsError } from '@/presentation/errors/invalid-params-error'
import { MissingParamsError } from '@/presentation/errors/missing-params-error'
import { badRequest } from '@/presentation/helpers/http-helper'
import { Controller } from '@/presentation/protocols/controller'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'

export class MissingPasswordController implements Controller {
  private readonly _findUser: FindUser
  private readonly _emailValidator: EmailValidator

  constructor (findUser: FindUser, emailValidator: EmailValidator) {
    this._findUser = findUser
    this._emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body

    if (!email) {
      return badRequest(new MissingParamsError('email'))
    }

    if (!this._emailValidator.isValid(email)) {
      return badRequest(new InvalidParamsError('email'))
    }

    await this._findUser.find(email)

    return Promise.resolve({ statusCode: 200, body: 'email recovery was send' })
  }
}
