## Creating a Docker Image

In order to run an app in a container we first need to create a Dockerfile. Dockerfile is a file that contains all the instructions needed to build a Docker image. Docker image is a snapshot of a container that contains all the necessary files and dependencies needed to run an app.

## Creating a Dockerfile

First, we need to create a Dockerfile. We can do this by running the following command:

```bash
touch Dockerfile
```

This will create a new file called `Dockerfile` in the current directory. We can then open this file in a text editor and add the following content:

```Dockerfile
# Dockerfile

# Use the official Node.js image as a base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy necessary files to the container
COPY .next/standalone .
COPY .next/static ./.next/static
COPY ./public ./public

# Expose the port the app runs on
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

USER node

# Start the app
CMD ["node", "server.js"]
```

## Dockerfile Commands

Here are the most common commands used in a Dockerfile:

- `FROM`: This command specifies the base image that we want to use. In our case we are using the official Node.js image with the tag `22-alpine`.
- `WORKDIR`: This command sets the working directory inside the container. All subsequent commands will be run from this directory.
- `COPY`: This command copies files from the host machine to the container. In our case we are copying the `standalone` directory, `static` directory and `public` directory.
- `EXPOSE`: This command exposes a port inside the container. In our case we are exposing port `3000`.
- `RUN`: This command runs a command inside the container. We are not using this command in our Dockerfile, but it is worth mentioning that it is a common command used to install dependencies or run build scripts.
- `ENV`: This command sets environment variables inside the container. In our case we are setting the `NODE_ENV` variable to `production`.
- `USER`: This command sets the user that should run the container. In our case we are using the `node` user.
- `ARG`: This command defines a build-time argument that can be passed to the Dockerfile.
- `CMD`: This command specifies the command that should be run when the container starts. In our case we are running the `server.js` file.

Full list of Dockerfile commands can be found in the official Docker documentation: [Dockerfile reference](https://docs.docker.com/reference/dockerfile/).

## Using Existing Docker Images

In our Dockerfile we are using the official Node.js image as a base image. This is a common practice as it allows us to use existing images that are maintained by the community. There are many official images available on Docker Hub: [Docker Hub](https://hub.docker.com/). In our example, Node.js image comes from https://hub.docker.com/_/node.

You can of course create your own Docker images, publish them to a docker image repository and use them as base images in your Dockerfiles. This is useful when you need to customize the environment or add specific tools or dependencies to the image.

Although you will find images that are based on many Linux distributions, it is recommended to use Alpine Linux based images when possible. Alpine Linux is a lightweight Linux distribution that is designed for security, simplicity, and resource efficiency. Alpine Linux based images are smaller in size and have fewer security vulnerabilities compared to other Linux distributions.

[scratch](https://hub.docker.com/_/scratch) is a special base image that is empty and does not contain any files or dependencies. It is useful when you want to create a minimal image that contains only the necessary files to run an app.

## Dockerfile Best Practices

Here are some best practices to keep in mind when writing a Dockerfile:

- Use official images whenever possible, preferably Alpine Linux based images
- Use `.dockerignore` file to exclude unnecessary files from the build context
- Use multi-stage builds to reduce the size of the final image
- Use environment variables to pass configuration to the container
- Use `USER` command to run the container as a non-root user
- Use `WORKDIR` command to set the working directory inside the container
- Use `EXPOSE` command to expose ports inside the container
- Use `CMD` command to specify the command that should be run when the container starts

## Building the Docker Image

With the Dockerfile in place we can now build a Docker image. We can do this by running the following command:

```bash
docker build -t my-next-app .
```

This will build a Docker image with the tag `my-next-app`. We can then run this image in a container by running the following command:

## Running the Docker Container

With the Docker image built we can now run it in a container. We can do this by running the following command:

```bash
docker run my-next-app
```

Usually to stop the container it is enough to press `Ctrl+C` in the terminal where the container is running. Unfortunately, this does not work with Next.js. To stop the container we need to run the following command in a new terminal:

Find the container ID:

```bash
docker ps
CONTAINER ID   IMAGE                  COMMAND                  CREATED         STATUS         PORTS                                       NAMES
55f808123850   my-next-app            "docker-entrypoint.s…"   8 seconds ago   Up 7 seconds   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   amazing_dubinsky

```

Stop the container:

```bash
docker stop 55f808123850
```

## Checking the Size of the Docker Image

To check the size of the Docker image we can run the following command:

```bash
docker images
REPOSITORY      TAG            IMAGE ID       CREATED         SIZE
my-next-app     latest         3d9489a7b7b7   3 days ago      199MB
```

Size of the image is important as it affects the time it takes to download and run the image, but also the amount of disk space it takes on the host machine. It is recommended to keep the size of the image as small as possible by following the best practices mentioned above.

## Summary

With all the files setup and committed to the repository, in order to build and run the app in a container we need to:

1. Checkout the latest version of the repository
1. Build the app: `npm run build`
1. Build the Docker image: `docker build -t my-next-app .`
1. Run the Docker container: `docker run -p 3000:3000 --rm my-next-app`
