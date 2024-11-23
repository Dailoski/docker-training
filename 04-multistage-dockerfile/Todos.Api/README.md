# Exercise 4: Using Multi-stage Dockerfile for the Todos.Api project

In this exercise, you will create a multi-stage Dockerfile for the Todos.Api project. The Dockerfile will contain instructions to build the project and create a runtime image for the Todos.Api project. With multi-stage Dockerfiles, you don't need to install build tools on the host machine to build the project. The final Docker image will be smaller in size as it will only contain the necessary files to run the project.

## Pre-requisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Instructions

1. Create a new file called `Dockerfile` in the `Todos.Api` project directory.
2. Open the `Dockerfile` in a text editor and add the following content:

```Dockerfile
# Dockerfile

# Build stage
# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

# copy everything else and build app
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "Todos.Api.dll"]
```

3. Save the file and close the text editor.
4. Build the Docker image using the following command:

```bash
docker build -t todos-api .
```

5. Inspect the size of the Docker image by running the following command:

```bash
docker images todos-api
```

NOTE: The size of the Docker image is the same as in the previous exercise. This is because the `build` stage is not included in the final image.

6. Run the Docker container using the following command:

```bash
docker run -d -p 8080:8080 todos-api
```

7. View running containers by running the following command:

```bash
docker ps
```

8. Open your browser and navigate to [http://localhost:8080/api/ping](http://localhost:8080/api/ping) to see the result. You should see `pong unknown` in the browser.

9. Stop the container by running the following command:

```bash
docker stop {{CONTAINER_ID}}
```

## Summary

In this exercise, you learned how to create a multi-stage Dockerfile for the Todos.Api project. The multi-stage Dockerfile helps to reduce the size of the final Docker image by using separate build and runtime stages. Multi-stage files also simplify the build process as we don't need to install build tools on the host machine in order to build the project.
