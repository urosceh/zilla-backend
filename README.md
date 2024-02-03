## Prerequisites

You have to have [Docker](https://docs.docker.com/engine/install/) installed.
You have to have [Node](https://nodejs.org/en/download/package-manager#nvm) installed.

## Setup

To setup the project run:

```bash
make prepare-dev
```

The make script will create Postgres and Redis docker containers. It will also run migrations for the database.

## Run

Before running the project, you need to rename **.env.example** file to **.env**. You must add ADMIN_EMAIL and ADMIN_PASSWORD. Other parameters are not necessary.
Run

```bash
npm run init # creates an admin user with ADMIN_EMAIL and ADMIN_PASSWORD
```

To run the project go to **Run and Debug** VsCode menu and select **Run App** configuration.
See _*documentation/api-docs.yaml*_ to find more about the API.

## Seed

You need to have admin user in order to seed the data.
To seed database with test data first run the app, then go to **Run and Debug** VsCode menu and run **Seed App** configuration.

# Purge

To purge the database of test data first run the app, then go to **Run and Debug** VsCode menu and run **Purge App** configuration.

### Sending mails

When admin user sends _/api/user/create-batch_ request with emails in the body, users are created with those emails and have a password generated for them. The password, if NODE_ENV == "test" is appended to **passwords.txt** file in the root of the directory.
However if you want mails to be sent, you need to create [Mailjet](https://app.mailjet.com/signin?) account, find your [Credentials](https://app.mailjet.com/account/apikeys) and paste the values, along with the email you used to create Mailjet account, into **mail client** configuration of the .env file.
