### This is a summary of the E-Commerce website.

# Instructions for setting up the project:
1. Create a .env with the following vars:
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
1. Then type "docker compose up". This should fire up 3 containers + a couple of scripts that insert the "mock-data" into the DB.
2. Run "docker compose up -d --build app" if needed.

# Project Pages
This project has the following pages (I will also send screenshots of all pages via email)
1. Products / cart
2. Login
3. Register
4. Checkout
5. Order-Confirmation

# DB buildup
This project is using Postgres as DB. This is not a big data project so there is no good reason to use NoSQL, and a relational DB is the suitable choice for this kind of project.
There are 2 forms of fetching data, from DB and from Redis:
1. DB - I fetch from the DB product queries such as where price, pagination, collections. The queries are also cached so if a customer already did this request not long ago he will not get it from the DB (TTL 10 minutes). Also the checkout / login / register are from the DB.
2. Redis - The product page has a "CATEGORY" section, this shows per collection the amount of items, and if there are millions of items it can be a little heavy & time consuming, so this is also cached. */scripts/populate-collection-filter.ts* aggregates the data and inserts it into Redis. In the real world this would be a cron job that runs every X minutes.
3. There are 13 tables that manage users && products && orders.

# State Management
1. Cart - for the cart I used "Zustand". This manages the state, but when restarting the browser the cart doesn't persist, so local storage fixes that issue.

# Images
I created a public folder that imitates an S3 and changed some images so the headphones have images of headphones and not landscapes. I didn't do it to all images... (time).

# Auto-Complete
I also implemented an auto-complete mechanism with a 3 second delay between letters.

# Validation
Most of the validations are with the Zod library and of course Prisma DB validation, so I will not write raw SQL and have an SQL injection.

# Key Decisions
SQL is a limited resource, so data should be cached as much as possible. Also the initial products feed can be cached, but this depends on if we want to show the customer the same feed every time or based on cookies.

# Tradeoffs
Tests are something there is never enough of and I can always add more.
I don't think I should build this part differently, I think this is a good implementation (but still in Hebrew we say טלח). Also the most important component in a successful application is the error handling, so if I had more time I would make sure it works as expected, make sure that no specific errors from the server are visible, and have a logging system (Datadog / Logz...).

# Verification
In general I have tests for each route that I run after each change.

# Surprises
It wasn't 100% clear if I need to build this website using the "mock-data" as is (NoSQL) or use the exact same data and manage it as I think the website should be built. My native DB experience is more NoSQL than SQL, but I thought NoSQL is less good for this use case. But it does use the "src/types/product.ts" and it was not changed !