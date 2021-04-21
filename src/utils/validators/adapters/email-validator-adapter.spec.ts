import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator',() => ({
  isEmail (): boolean {
    return true
  }
}))
interface SutTypes{
  sut: EmailValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter()
  return { sut }
}

describe('EmailValidatorAdapter', () => {
  test('should returns false if validator lib return false',() => {
    const { sut } = makeSut()
    jest.spyOn(validator,'isEmail').mockReturnValueOnce(false)

    const isValidEmail = sut.isValid('invalid_email@gmail.com')
    expect(isValidEmail).toBe(false)
  })
  test('should returns true if validator lib return true',() => {
    const { sut } = makeSut()

    const isValidEmail = sut.isValid('valid_email@gmail.com')

    expect(isValidEmail).toBe(true)
  })
  test('should call correct param in validator lib when isValid passed data',() => {
    const { sut } = makeSut()
    const validatorLibStub = jest.spyOn(validator,'isEmail')

    const validEmail = 'valid_email@gmail.com'
    sut.isValid(validEmail)

    expect(validatorLibStub).toHaveBeenCalledWith(validEmail)
  })
})
