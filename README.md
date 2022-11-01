# Northcoders Games API Backend Project

## Summary

This is a backend API which provides data from the Northcoders Games database, a PSQL database which is accessed via the provided endpoints and methods.

## The hosted version of this api can be found here:

https://northcoders-games-project.herokuapp.com/

## Setup

To set up your own repository follow the steps below:

1. Clone this repo in your usual directory for your projects with the following command:

```
git clone https://github.com/jpchadwick92/nc-backend-project.git
```

2. Navigate to the new directory with

```
cd nc-backend-project
```

3. Install the necessary dependancies by running

```
npm install
```

4. To connect to the relevant databases:

- Create a .env.development file in the root of the directory containing
  `PGDATABASE=nc_games`

- Create a .env.test file in the root of the directory containing
  `PGDATABASE=nc_games_test`

5. Now create and seed the databases by running these two commands:

```
npm run setup-dbs

npm run seed
```

6. To run the server locally run

```
npm start
```

7. To run the tests use

```
npm test
```

## Minimum Requirements

- Node v18.9.0
- Postgres v14.5
- node package manager v8.19.1
