# Pushing Docker Image

In the previous section we have created a Docker image for our Next.js app. In this section we will push this image to remote registry so that it can be shared with others or deployed to production. In this example we will push to AWS Elastic Container Registry (ECR), there are other image registries where you can host your docker images like: Docker Hub, Google Container Registry, Azure Container Registry, etc.

## Pushing the Docker Image

Make sure that you have aws cli installed https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html.

**Get the aws credentials from your trainer** and configure the aws cli by running the following command:

```bash
aws configure
```

Run the following command to confirm that the aws cli is configured correctly:

```bash
aws sts get-caller-identity
```

Output should look similar to this:

```json
{
  "UserId": "AIDAJDPLRKLG7EXAMPLE",
  "Account": "936223510818",
  "Arn": "arn:aws:iam::936223510818:user/user1"
}
```

After that, we can login to AWS ECR by running the following command:

```bash
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 936223510818.dkr.ecr.eu-central-1.amazonaws.com
```

Now we can tag the docker image with the ECR repository URL:

```bash
docker tag my-next-app:latest 936223510818.dkr.ecr.eu-central-1.amazonaws.com/user1-repo:latest
```

And finally push the image to ECR:

```bash
docker push 936223510818.dkr.ecr.eu-central-1.amazonaws.com/user1-repo:latest
```
