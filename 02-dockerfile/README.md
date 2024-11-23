# Exercise 2: Create a Dockerfile for the Todos.Api project

In this exercise, you will create a Dockerfile for the Todos.Api project. The Dockerfile will contain instructions to set up the environment for the Todos.Api project.

## Pre-requisites

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/downloads)
- [Dotnet SDK](https://dotnet.microsoft.com/download)

## Getting Started

Run the project locally:

```bash
MY_NAME="{{YOUR_NAME}}" dotnet run
```

Open [http://localhost:5019/api/ping](http://localhost:5019/api/ping) in your browser to see the result. If you see `pong unknown` then you didn't set the `MY_NAME` environment variable correctly.

## Instructions

1. Build you app using the following command:

```bash
dotnet publish -c Release -o out
```

2. Create a new file called `Dockerfile` in the `Todos.Api` project directory.
3. Open the `Dockerfile` in a text editor and add the following content:

```Dockerfile
# Dockerfile

# Use the official .NET runtime image as a base image
FROM mcr.microsoft.com/dotnet/aspnet:9.0

# Set the working directory inside the container
WORKDIR /app

# Copy the build output from the build stage
COPY ./out .

# Expose the port the app runs on
EXPOSE 8080

# Declare environment variables needed for your project to run
ENV MY_NAME="{{YOUR_NAME}}"

# Start the app
CMD ["dotnet", "Todos.Api.dll"]
```

4. Save the file and close the text editor.
5. Build the Docker image using the following command:

```bash
docker build -t todos-api .
```

6. List the Docker images using the following command:

```bash
docker images
```

NOTE: You should see the `todos-api` image in the list and the size of the image, it's size should be around 255MB. You can also run `docker inspect todos-api` to see the image details.

6. Run the Docker container using the following command:

```bash
docker run -d -p 8080:8080 todos-api
```

7. Open [http://localhost:8080/api/ping](http://localhost:8080/api/ping) in your browser to see the result.

8. Find the container ID using the following command:

```bash
docker ps
```

9. View the logs of the running container using the following command:

```bash
docker logs {{CONTAINER_ID}}
```

10. Stop the container using the following command:

```bash
docker stop {{CONTAINER_ID}}
```

11. Remove the container using the following command:

```bash
docker rm {{CONTAINER_ID}}
```

## Summary

In this exercise, you learned how to create a Dockerfile for the Todos.Api project. You also learned how to build a Docker image, run a Docker container, view the logs of the running container, stop the container, and remove the container.
