# Jest Tests

Project to provide a set of unit/nintegration and e2e tests in jest lib.

To ensure a good pratices in the project development, was included some `libs` to provide a environment where the commits and source code should respect some rules as:
 should´n contain lint erros and tests should have passed ever.

The `libs` used to provide this environment:

- lint-staged
- husky (configured: pre-commit and pre-push hooks)

The use-cases uses in this projet to learn `jest` tests are:
- User Login
  - Fields Validation ✅  (unit-tests)
  - Logon Success ✅  (unit-tests)
  - Logon Failure ✅  (unit-tests)
  - Application failure ✅  (unit-tests)
  - User not exist✅  (unit-tests)
  - User missing password (unit tests)🚸 
  - User blocked to many access attempts 
  - User change credentials (email)
  
  
Commands to run the tests(after clone this repository):

  run the tests ``yarn test``
  run the tests and provide a automatic env to re-run ``yarn test:unit``
  run the tests and provide a coverage``yarn test:ci``
  
Futures Refactors:
 - Factory Method to Create Business Objects
 - Template Method in Handler Controllers (validations and others similarity sources)

Contribute to this Idea and have happy weekends without bugs and boss calls 🤗.
