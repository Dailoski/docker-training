# Exercise 1: Run docker container from Docker Hub image

In this exercise, we will run a Docker container from an already created image that is hosted on Docker Hub.

## Pre-requisites

- [Docker](https://docs.docker.com/get-docker/)

## Instructions

1. Run the following command to start a container from the `nginx` image:

```bash
docker run -d -p 8080:80 --name my-nginx nginx
```

> [!NOTE] > `-d` flag runs the container in the background. `-p` flag exposes the port `80` from the container to the host on port `8080`. If the image is not available locally, Docker will pull the image from Docker Hub before starting the container.

2. View running containers by running the following command:

```bash
docker ps
```

3. View the logs of the container by running the following command:

```bash
docker logs my-nginx
```

4. Open your browser and navigate to [http://localhost:8080](http://localhost:8080) to see the default Nginx page. You should see the welcome page of Nginx.

5. Stop the container by running the following command:

```bash
docker stop my-nginx
```

6. Remove the container by running the following command:

```bash
docker rm my-nginx
```

7. Remove the `nginx` image by running the following command:

```bash
docker rmi nginx
```

Optional:

- Run `nginx` on a port 8090
- Find all containers which are stopped on your machine
- Run a different version of `nginx` image
- Run a `hello-world` image, see the output, and remove the container
- When you run `docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres` what does `-e` flag do?
- Run `rabbitmq` image and login to the management console
- Figure out how to run a container and remove automatically it after it stops. See `docker run` help for more info.

## Summary

In this exercise, you learned how to run a Docker container from an image hosted on Docker Hub. You also learned how to view the logs of the running container, stop the container, and remove the container and image.

For more information on the `docker run` command, refer to the [official documentation](https://docs.docker.com/reference/cli/docker/container/run/).
