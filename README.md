# Humanity In Business App Backend
To know more about the company: https://www.humanityinbusiness.com.au

## Our Goal
This project aim to build a social platform and leverage gamification to engage skilled volunteers to contribute to charities project.

## Technologies

* Node.js
* Restify
* Postgres SQL

## Install

`npm install`

### Setup Database
Prerequisites: Postgres SQL Server running (recommended version 11.4)

1. Create a database
2. Execute `sql/setup.sql` to create tables and sample data
3. Setup your .env file (follow `.env.example` for example) 

## Run

`npm run dev`

## e2e Tests
To test the API End to End
Test data comes from `sql/setup.sql`

`npm run e2e`

## Contribute

Make a Merge Request to Master and ask for a review. Once merged the code will deployed automatically.

## CI/CD

CI/CD is run on Circle CI
The app is deployed on Heroku




