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

10. Create init script `init.sh`:

```bash
#!/bin/bash

# Get the current date and time
CURRENT_DATETIME=$(date)

# Print the current date and time to the console
echo "Initialization started at: $CURRENT_DATETIME"

# Store the current date and time in the file
echo "Initialization timestamp: $CURRENT_DATETIME" > /app/initialized.txt

# Print confirmation message
echo "Initialization complete. Timestamp saved to /app/initialized.txt"

# Execute the main command passed to the script
exec "$@"
```

11. Update the `Dockerfile` to use the `init.sh` script as the entrypoint:

```Dockerfile
FROM ubuntu
RUN apt-get update && apt-get install -y curl
COPY init.sh /app/init.sh
RUN chmod +x /app/init.sh
ENTRYPOINT ["/app/init.sh"]
CMD ["curl", "https://example.com"]
```

12. Save the file and close the text editor.
13. Build the Docker image using the following command:

```bash
docker build -t my-curl-init .
```

14. Run the Docker container using the following command:

```bash
docker run --rm my-curl-init
```

15. Verify that the output of the `curl` command is displayed in the console and the initialization script is executed.

16. Run prune command to remove all stopped containers:

```bash
docker system prune
```

> [!NOTE]
> Check what options are available for the `docker system prune` command: https://docs.docker.com/reference/cli/docker/system/prune/.
