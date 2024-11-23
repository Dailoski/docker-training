# Exercise 5: Push Docker image to AWS Elastic Container Registry (ECR)

In this exercise, you will push the Docker image for the Todos.Api project to AWS Elastic Container Registry (ECR). AWS ECR is a fully managed container registry that makes it easy to store, manage, share, and deploy Docker container images.

## Pre-requisites

- [Docker](https://docs.docker.com/get-docker/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)

## Instructions

1. Make sure you have the AWS CLI installed on your machine. You can check the installation by running the following command:

```bash
aws --version
```

2. Ask your trainer for the AWS credentials and configure the AWS CLI by running the following command:

```bash
aws configure
```

3. Run the following command to confirm that the AWS CLI is configured correctly:

```bash
aws sts get-caller-identity
```

Output should look similar to this:

```json
{
  "UserId": "AIDAJDPLRKLG7EXAMPLE",
  "Account": "711387109540",
  "Arn": "arn:aws:iam::711387109540:user/user1"
}
```

4. Log in to AWS ECR by running the following command:

```bash
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 711387109540.dkr.ecr.eu-central-1.amazonaws.com
```

5. Build the Docker image for the Todos.Api project using the following command:

```bash
docker build -t todos-api .
```

6. Tag the Docker image with the ECR repository URL:

```bash
docker tag todos-api:latest 711387109540.dkr.ecr.eu-central-1.amazonaws.com/user1-repo:latest
```

7. Push the Docker image to ECR:

```bash
docker push 711387109540.dkr.ecr.eu-central-1.amazonaws.com/user1-repo:latest
```

8. Remove the Docker image from your local machine by running the following command:

```bash
docker rmi 711387109540.dkr.ecr.eu-central-1.amazonaws.com/user1-repo:latest
```

9. Run the Docker container from the image stored in ECR by running the following command:

```bash
docker run -d -p 8080:8080 711387109540.dkr.ecr.eu-central-1.amazonaws.com/user1-repo:latest
```

10. Open [http://localhost:8080/api/ping](http://localhost:8080/api/ping) in your browser to see the result.

11. Stop the container by running the following command:

```bash
docker stop {{CONTAINER_ID}}
```

## Summary

In this exercise, you learned how to push a Docker image to AWS Elastic Container Registry (ECR) and run a Docker container from the image stored in ECR.

For more information on AWS Elastic Container Registry (ECR), refer to the [official documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html). For more information on the `docker push` command, refer to the [official documentation](https://docs.docker.com/engine/reference/commandline/push/).
