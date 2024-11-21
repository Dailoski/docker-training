# Docker Compose

Docker Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application's services. Then, with a single command, you create and start all the services from your configuration.

In this section we will create a `docker-compose.yml` file that will define our Next.js app and a PostgreSQL database. We will then use Docker Compose to start both services and run our app.

## Creating a `docker-compose.yml` File

First, we need to create a `docker-compose.yml` file in the root of our project with following content:

```yaml
# docker-compose.yml

version: "3.8"

services: # Define the services that make up our app
  app:
    build: . # Build an image from the current directory
    ports:
      - "3000:3000" # Expose port 3000
    depends_on: # Wait for the db service to be ready before starting the app
      - db
  db:
    image: postgres:15.0-alpine # Use the official PostgreSQL image
    ports:
      - "5432:5432" # Expose port 5432
    environment: # Set environment variables that are used by the PostgreSQL image
      POSTGRES_PASSWORD: "postgres"
      POSTGRES_DB: "docker-training"
    volumes: # Mount a volume to persist the database data outside of the container
      - db-data:/var/lib/postgresql/data

volumes: # Define a volume that will be used by the db service
  db-data:
    driver: local
```

This file defines two services: `app` and `db`. The `app` service will build an image from the current directory and expose port `3000`. The `db` service will use the official PostgreSQL image and set some environment variables.

For full reference of features and options available in `docker-compose.yml` file, please refer to the official Docker Compose documentation: [Compose file reference](https://docs.docker.com/reference/compose-file/).

## Starting the Services

With the `docker-compose.yml` file in place we can now start the services. We can do this by running the following command:

```bash
docker-compose up
```

This will start both services and run our app. We can then open [http://localhost:3000](http://localhost:3000) in a web browser to see the result.

To stop the services we can press `Ctrl+C` in the terminal where the services are running. This will stop the services and remove the containers.

You can also run the services in the background by using the `-d` flag:

```bash
docker-compose up -d
```

It is important to note that Docker Compose creates a default network for your services. This allows services to communicate with each other using their service names. For example, the `app` service can connect to the `db` service using the hostname `db`. Nothing from outside of the network can connect to the services unless you explicitly expose ports.

## Checking the Status of the Services

To check the status of the services we can run the following command:

```bash
docker-compose ps
```

## Viewing Logs

To view the logs of the services we can run the following command:

```bash
docker-compose logs
```

To view the logs of a specific service we can use the service name:

```bash
docker-compose logs app
```

## Stopping the Services

To stop the running services we can run the following command:

```bash
docker-compose stop
```

## Cleaning Up

To remove the containers and volumes created by Docker Compose we can run the following command:

```bash
docker-compose down
```
