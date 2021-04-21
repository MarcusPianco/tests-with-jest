export class InvalidParamsError extends Error {
  constructor (nameField: string) {
    super(`O campo ${nameField} é Inválido`)
    this.name = 'InvalidParamsError'
  }
}
