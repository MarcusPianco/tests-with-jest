# Jest Tests

Project to provide a set of unit/nintegration and e2e tests in jest lib.

To ensure a good pratices in the project development, was included some `libs` to provide a environment where the commits and source code should respect some rules as:
 should´n contain lint erros and tests should have passed ever.

The `libs` used to provide this environment:

- lint-staged
- husky (configured: pre-commit and pre-push hooks)

The use-cases uses in this projet to learn `jest` tests are:
- User Login
  - Fields Validation ✅ (100%-100% coverage)
  - Lgon Success
  - Logon Failure
  - Application failure
  - User missing password (and renew pass)
  - User blocked to many access attempts
  - User change credentials (email)
  
  
Commands to run the tests(after clone this repository):

  run the tests ``bash yarn test``
  run the tests and provide a automatic env to re-run ``bash yarn test:unit``
  run the tests and provide a coverage``bash yarn test:ci``
  
Contribute to this Idea and have happy weekends without bugs and boss calls 🤗.
