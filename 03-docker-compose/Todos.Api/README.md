# Exercise 3: Create a Docker Compose file for the Todos.Api project

In this exercise, you will create a Docker Compose file for the Todos.Api project. The Docker Compose file will define the services required to run the Todos.Api project, including the Todos.Api service and a PostgreSQL database service.

## Pre-requisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [Dotnet SDK](https://dotnet.microsoft.com/download)

## Project Structure

`Program.cs` - The entry point of the application. It also runs migrations on the database.
`Extensions/DatabaseExtensions.cs` - Contains extension methods for migrating the database.
`Scripts/` - Contains SQL scripts for creating the database schema.
`Startup.cs` - Configures the application controllers and DI.
`Controllers/TasksController.cs` - Contains the API endpoints for managing tasks.
`Models/Task.cs` - Represents a task in the database.
`Repositories/TaskRepository.cs` - Repository for managing tasks in the database.
`appsettings.json` - Contains the application settings. In this file connection string `DefaultConnection` to the database is defined.

## Instructions

1. Make sure application builds correctly by running the following command:

```bash
dotnet publish -c Release -o out
```

2. Create a new file called `docker-compose.yml` in the `Todos.Api` project directory.
3. Open the `docker-compose.yml` in a text editor and add the following content:

```yaml
version: "3.8"

services:
  db:
    image: postgres:15.0-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: "postgres"
      POSTGRES_DB: "todos"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
    driver: local
```

6. Save the file and close the text editor.
7. Run the following command to start the services defined in the Docker Compose file:

```bash
docker-compose up -d
```

8. View the logs of the services by running the following command:

```bash
docker-compose logs
```

NOTE: You should see "database system is ready to accept connections" in the logs for the `db` service.

9. Run the application using the following command:

```bash
dotnet run
```

10. Open [http://localhost:5019/api/tasks](http://localhost:5019/api/tasks) in your browser to see the result. You should see an empty array `[]` as there are no tasks in the database.

11. Create a new task by sending a POST request to [http://localhost:5019/api/tasks](http://localhost:5019/api/tasks) with the following JSON payload:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"description": "Learn Docker", "completed": false}' http://localhost:5019/api/tasks
```

12. Open [http://localhost:5019/api/tasks](http://localhost:5019/api/tasks) in your browser to see the result. You should see the newly created task in the response.

13. Stop the services by running the following command:

```bash
docker-compose down
```

14. Add the application service to the Docker Compose file by updating the `docker-compose.yml` file with the following content:

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      ConnectionStrings__DefaultConnection: "Server=db;Port=5432;Database=todos;;Username=postgres;Password=postgres"
  db:
    image: postgres:15.0-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: "postgres"
      POSTGRES_DB: "todos"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
    driver: local
```

15. Run the following command to start the services defined in the updated Docker Compose file:

```bash
docker-compose up -d
```

16. View the logs of the services by running the following command:

```bash

docker-compose logs
```

17. Open [http://localhost:8080/api/tasks](http://localhost:8080/api/tasks) in your browser to see the result. You should see the newly created task in the response.

18. Clean up the resources by running the following command:

```bash
docker-compose down --rmi all -v --remove-orphans
```

## Summary

In this exercise, you learned how to create a Docker Compose file for the Todos.Api project. You also learned how to define services for the Todos.Api project and a PostgreSQL database service in the Docker Compose file. You ran the services using Docker Compose and interacted with the application to create a new task in the database. Finally, you updated the Docker Compose file to include the application service and ran the services again to verify the changes.
