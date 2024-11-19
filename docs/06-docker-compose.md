# Docker Compose

Docker Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application's services. Then, with a single command, you create and start all the services from your configuration.

In this section we will create a `docker-compose.yml` file that will define our Next.js app and a PostgreSQL database. We will then use Docker Compose to start both services and run our app.

## Creating a `docker-compose.yml` File

First, we need to create a `docker-compose.yml` file in the root of our project with following content:

```yaml
# docker-compose.yml

version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:15.0-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: "postgres"
      POSTGRES_DB: "docker-training"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
    driver: local

```

This file defines two services: `app` and `db`. The `app` service will build an image from the current directory and expose port `3000`. The `db` service will use the official PostgreSQL image and set some environment variables.

## Starting the Services

With the `docker-compose.yml` file in place we can now start the services. We can do this by running the following command:

```bash
docker-compose up
```

This will start both services and run our app. We can then open [http://localhost:3000](http://localhost:3000) in a web browser to see the result.

## Stopping the Services

To stop the services we can press `Ctrl+C` in the terminal where the services are running. This will stop the services and remove the containers.
