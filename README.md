# be-nc-news

Hello, this is a the first app that I've made for backend applications for NC-NEWS.

---

## Hosted Version

 -- https://nc-news-project-w66a.onrender.com/api
 
  (note: spin-up period may take couple of minutes )
---

## Project Summary

This RESTful API provides a structured way to access application data, supporting full CRUD operations for managing articles, topics, users, and comments. It mimics the functionality of a real-world backend news platform, similar to services like Reddit, and is designed to supply data to frontend applications.

Key Features:
CRUD Operations: Allows clients to create, read, update, and delete data related to articles, topics, users, and comments.
Advanced Queries: Supports complex database queries, including sorting, ordering, limiting, and pagination through parametric endpoints.
MVC Architecture: Developed using the Model-View-Controller (MVC) design pattern for clean, maintainable code.
Test-Driven Development (TDD): The API is built with a focus on testing to ensure reliability and functionality.
A live version of this API is hosted online. Follow the link below to explore detailed documentation, including the full list of available endpoints, example queries, and typical responses. Please allow a minute or two for the server to initialize on first access.

Hosted version of the project: [Here](https://nc-news-project-w66a.onrender.com/api)

For Chrome users, recommend installing a JSON viewer extension to better format the API responses for easier readability.

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
- **PostgreSQL** Minimum version `v16.4`


### Steps

1. Clone the repository:
git clone https://https://github.com/Onuryilmaz24/nc-news-project.git

2. Install dependencies:
- Dependencies:
    + Posgtres
    + express
-Dev Dependencies
    + pg-format
    + dotenv
    + jest
    + jest-sorted
    + nodemon
    + husky
    + supertest

To get these running on your machine, run this command in your terminal:
  ```bash
   npm install
   ```      
     
4. Setup Database
   - In order to setup test and development database you need to set up two `.env` files in root directory:
   - .env.test
       - Inside this file you need to write:
         ` PGDATABASE=nc_news_test`
   - .env.development
       - Inside this file you need to write:
         ` PGDATABASE=nc_news`

5. Set up the local database:
   - Ensure PostgreSQL is running.
   - Create a new database:
     ```bash
     npm run setup-dbs
     ```
6. Seed the database:
   ```bash
   npm run seed
   ```
## Running the Project

1. Start the server:
   ```bash
   npm start
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
---
"This project was created by [Onur Yilmaz](https://github.com/Onuryilmaz24) as part of the Digital Skills Bootcamp in Software Engineering course provided by [NorthCoders](https://northcoders.com/)."
