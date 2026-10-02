
### The is a summay of the E-Commerance website.

# Instruction for setting up the project:
1. create a .env with the following vars:
POSTGRES_USER=youleap
POSTGRES_PASSWORD=youleap
POSTGRES_DB=youleap
POSTGRES_PORT=5432

DATABASE_URL=postgresql://youleap:youleap@localhost:5432/youleap
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
APP_URL=http://localhost:3000

SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=admin
SEED_ADMIN_EMAIL=admin@goodsmith.test

JWT_SECRET=Vlh+4Os8MppwCPpIev6fuudALBvBa079oHs7OlJTLkoZuz8jE/X7cCzd+9eA/KsA
1. then type "docker compose up" this should fire up 3 containers + a couple of scripts the insert the "mock-data" into the DB.
2. run "docker compose up -d --build app" if needed.

# Project Pages
This project has the following pages (I will also send via email screenshots of all pages)
1. Products / cart
2. Login
3. Registed
4. checkout 
5. Order-Confimation

# DB buildup
This project is using Postgress as db, this is not a bigdata project so there is no good reason to use NoSql and relational DB is the sutible chioose for this kind of project.
There are 2 forms of fetching data, from DB and from Redis:
1. DB - I fetch from the db product queries such as where price, pagination, collections, the queries are also cached so if a customer already did this request not long ago he will not get it from the DB (TTL 10 minutes). Also the checkout / login / register are from the DB.
2. Redis - The product page has a "CATEGORY" section, this shows per collection the amount of items and if there are million of items it can be a little heavy & time consuming so also this is cached */scripts/populate-collection-filter.ts* aggregates the data and inserts into the redis. In real world this would be a cron job that will run every X minutes.
3. There are 13 table that manage user && products && order

# State Managment
1. Cart - for the cart i used "Zustand" this manages the state but when restarting the browser the cart dosent presist so local storage fixes that issue.

# Validation
Most of the validation are with Zod library and of course prisma db validation so i will not write raw Sql and have a sql injection.

# Key Decisions
SQL is a limited resource, so data should be cached as much as possible. Also caching the init products feed can be cached but this depends on if we waht to show the customer the same feed everytime of based cookies.

# Tradeoffs
Tests is something that there is never inof and i can always add more.
I dont this i hould build this part different i think this is a good implementation (but still in hebrew we say טלח).

# Verification
In general i have tests for each route that i run after each change.


# Surprises
It wasent 100% clear if i need to build this website using the "mock-data" as is (NoSql) or use the exact same data and manage it as i think the website should be build, my Native DB experiance is more NoSql than SQL but i thought NoSql is less good for this use case.