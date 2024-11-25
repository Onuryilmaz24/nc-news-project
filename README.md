Add .env.development and .env.test files to main directory.

.env.development will be your development database so inside to file you need to write
PGDATABASE = nc_news

.env.test file will be your test database, so inside to file you need yo write
PGDATABASE = nc_news_test

After that head over to the connection.js file in db directory. You'll see your database will be implementing the system for both cases.

Then run "setup-dbs" in your console. Your databases will be created.
