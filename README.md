## Prerequisites

You have to have [Docker](https://docs.docker.com/engine/install/) installed
You have to have [Node](https://nodejs.org/en/download/package-manager#nvm) installed

## Setup

To setup the project run:

```bash
make prepare-dev
```

This make script will create Postgres database and Redis. It will run migrations for the database.

## Run

To run the project go to **Run and Debug** VsCode menu and select **Run App** configuration.
You need to rename **.env.example** file to **.env**.

# Sending mails

If you want mails to be sent, you need to create [Mailjet](https://app.mailjet.com/signin?) account, find your api and secret key and paste the values into \* _mail client_ \* configuration.
If you leave \* _NODE_ENV="test"_ \* on new user creation you will have the password of the user in the scripts/passwords.txt file
