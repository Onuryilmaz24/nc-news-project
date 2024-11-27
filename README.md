# be-nc-news

Hello, this is a the first app that I've made for backend applications for NC-NEWS.

---

## Hosted Version

 -- Not avaliable

---

## Project Summary

In this app you can search through the recent articles and comments about articles. Also you can find information about authors as well. The api allows you to access,delete,add or update data.

---

## Table of Contents

1. [Installation](#installation)
2. [Running the Project](#running-the-project)
3. [Environment Variables](#environment-variables)
4. [Technology Stack](#technology-stack)
5. [Testing](#testing)

---

## Installation

### Prerequisites
- **Node.js**: Minimum version `v22.3.0` 
- **Git** installed locally

## Dependencies
- **Posgtres**: npm install pg
- **express**: npm install express
- **pg-format**: npm install pg-format // Developer dependency
- **dotenv**: npm install dotenv -D // Developer dependency
- **jest**: npm install jest -D // Developer dependency
- **jest-sorted**: npm install jest-sorted -D // Developer dependency
- **nodemon**: npm install nodemon -D // Developer dependency
- **husky**: npm install husky -D // Developer dependency
- **supertest**: npm install supertest -D // Developer dependency



### Steps

1. Clone the repository:
git clone https://https://github.com/Onuryilmaz24/nc-news-project.git

2. Install dependencies:

3. Set up the local database:
   - Ensure PostgreSQL is running.
   - Create a new database:
     ```bash
     npm run setup-dbs
     ```
4. Seed the database:
   ```bash
   npm run seed
   ```
## Running the Project

1. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

You need to set up two `.env` files:

1. **`.env.development`** for local development.
2. **`.env.test`** for testing purposes.

### Example `.env.development` file:
```env
DATABASE_URL= your development database
```

### Example `.env.test` file:
```env
DATABASE_URL= your test database
```

---
## Technology Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Testing**: Jest, Supertest
- **Deployment**: Supabase, Render

---

## Testing

Run the test suite with the following command:

```bash
npm test

```

