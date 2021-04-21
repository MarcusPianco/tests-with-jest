import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator',() => ({
  isEmail (): boolean {
    return true
  }
}))
describe('EmailValidatorAdapter', () => {
  test('should returns false if validator lib return false',() => {
    const emailValidator = new EmailValidatorAdapter()

    jest.spyOn(validator,'isEmail').mockReturnValueOnce(false)

    const isValidEmail = emailValidator.isValid('invalid_email@gmail.com')
    expect(isValidEmail).toBe(false)
  })
})
