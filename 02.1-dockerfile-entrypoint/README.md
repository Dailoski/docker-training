# Exercise 2.1: Create a Dockerfile with an entrypoint script

In this exercise, you will practice creating a Dockerfile with an entrypoint script. The entrypoint script will be used to start the application inside the Docker container.

## Pre-requisites

- [Docker](https://docs.docker.com/get-docker/)

## Instructions

1. Create a new file called `Dockerfile`:

```Dockerfile
FROM ubuntu
RUN apt-get update && apt-get install -y curl
ENTRYPOINT ["curl"]
CMD ["https://example.com"]
```

2. Save the file and close the text editor.
3. Build the Docker image using the following command:

```bash
docker build -t my-curl .
```

4. Run the Docker container using the following command:

```bash
docker run --rm my-curl
```

5. Verify that the output of the `curl` command is displayed in the console.
6. Now run it with a different URL:

```bash
docker run --rm my-curl https://www.google.com
```

7. Verify that the output of the `curl` command is displayed for the new URL.

8. Override the entrypoint command by passing a different command:

```bash
docker run --rm --entrypoint=ls my-curl -la
```

9. Verify that the `ls -la` command output is displayed in the console.

10. Run prune command to remove all stopped containers:

```bash
docker system prune
```

> [!NOTE]
> Check what options are available for the `docker system prune` command: https://docs.docker.com/reference/cli/docker/system/prune/.
