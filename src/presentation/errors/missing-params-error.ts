export class MissingParamsError extends Error {
  constructor (nameField: string) {
    super(`O campo ${nameField} está faltando`)
    this.name = 'MissingParamsError'
  }
}
