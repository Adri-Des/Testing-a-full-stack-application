# Yoga

## Start the project

Git clone:

> git clone https://github.com/Adri-Des/Testing-a-full-stack-application.git

Go inside folder:

> cd yoga

Install dependencies:

> npm install

Launch Front-end:

> npm run start;

### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

By default the admin account is:
- login: yoga@studio.com
- password: test!1234


### Test

#### E2E

Launching e2e test:

> npm run e2e

Generate coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html

#### Unitary test

Launching test:

> npm run test

for following change:

> npm run test:watch
