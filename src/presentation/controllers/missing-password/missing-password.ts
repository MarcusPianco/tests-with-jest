import { FindUser } from '@/domain/usecases/find-user'
import { Controller } from '@/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'

export class MissingPasswordController implements Controller {
  private readonly _findUser: FindUser

  constructor (findUser: FindUser) {
    this._findUser = findUser
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this._findUser.find(httpRequest.body.email)

    return Promise.resolve({ statusCode: 200, body: 'email recovery was send' })
  }
}
