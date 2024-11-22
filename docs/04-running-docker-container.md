# Running a Docker Container

To run a Docker container we need to have a Docker image. We can either build an image ourselves or use an existing image from a registry like Docker Hub. When running a container we can specify various options like port mappings, environment variables, volumes, etc.

## Run

To run a Docker container we can use the `docker run` command:

```bash
docker run my-next-app
```

This will start a container with the image `my-next-app`. By default, the container will run in the foreground and we will see the output of the app in the terminal. To run the container in the background we can use the `-d` flag:

```bash
docker run -d my-next-app
```

When you start a container it gets a unique ID and a name. But you can also name the container yourself using the `--name` flag:

```bash
docker run --name my-container my-next-app
```

When you run a container by default the process doesn't accept input from the terminal. To run the container in interactive mode and attach the terminal to it we can use the `-it` flag:

```bash
docker run -it my-next-app
```

You will get a shell prompt inside the container and you can interact with the app running inside.

## View Logs

To view the logs of a running container we can use the `docker logs` command:

```bash
docker logs my-container
```

## Port Mappings

Port mappings allow us to map ports from the container to ports on the host machine. This is useful when we want to access services running inside the container from the host machine. For example, if our app is running on port `3000` inside the container, we can map this port to port `3000` on the host machine by using the `-p` flag:

```bash
docker run -p 3000:3000 my-next-app
```

## Environment Variables

Environment variables allow us to pass configuration to the container. We can set environment variables using the `-e` flag:

```bash
docker run -e NODE_ENV=production my-next-app
```

## Volumes

Volumes allow us to persist data outside of the container. This is useful when we want to store data that should survive container restarts. We can mount volumes using the `-v` flag:

```bash
docker run -v /path/on/host:/path/in/container my-next-app
```

## Listing Containers

To list all running containers we can use the `docker ps` command:

```bash
docker ps
CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS          PORTS                                       NAMES
5e2175ca36be   my-next-app            "docker-entrypoint.s…"   11 seconds ago   Up 11 seconds   3000/tcp                                    determined_engelbart

```

To list all containers (including stopped ones) we can use the `-a` flag:

```bash
docker ps -a
```

## Stopping Containers

To stop a running container we can use the `docker stop` command:

```bash
docker stop [container_id or container_name]
```

## Removing Containers

To remove a container after it has stopped we can use the `docker rm` command:

```bash
docker rm [container_id or container_name]
```

You can also add `--rm` flag to `docker run` command to automatically remove the container when it exits:

```bash
docker run --rm my-next-app
```
