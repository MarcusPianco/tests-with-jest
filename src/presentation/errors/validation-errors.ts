export class ValidationError extends Error {
  constructor () {
    super('A validação não pode ser feita')
    this.name = 'ValidationError'
  }
}
