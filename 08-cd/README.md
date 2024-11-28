# Exercise 8: Continuous Deployment with GitHub Actions

In this exercise, you will set up a GitHub Actions workflow to automate the deployment of the Todos.Api project to AWS App Runner. The workflow will trigger on every push to the `main` branch and will build and push the Docker image to AWS ECR. Once the image is pushed, it will deploy the application to AWS App Runner.

## Pre-requisites

- That you completed:
  - [Exercise 5: Push Docker image to AWS ECR](../05-docker-push/README.md)
  - [Exercise 6: Automate Docker image build and push using GitHub Actions](../06-ci/README.md)
  - [Exercise 7: Deploy the Todos.Api project to AWS App Runner](../07-deploy/README.md)

## Instructions

1. On your machine run the following command:

```bash
aws apprunner list-services
```

2. Copy the `service-arn` of the `todos-api` service. It should look similar to this:

```
arn:aws:apprunner:eu-central-1:711387109540:service/todos-api/7766efb78c044360857d4d571b93f7ea
```

3. In the Github repo you created in the previous exercises, open the file `.github/workflows/deploy.yml`.

4. Add the the deployment part to the workflow:

Make sure to update the `SERVICE_ARN` with the `service-arn` you copied in step 2.

```yaml
name: Build and Push Docker image

on:
  push:
    branches:
      - main

env:
  AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
  SERVICE_ARN: "{{ HERE_YOUR_SERVICE_ARN }}"

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the repository
      - name: Checkout code
        uses: actions/checkout@v3

      # Step 2: Configure AWS credentials
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v3
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      # Step 3: Authenticate to AWS ECR
      - name: Log in to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      # Step 4: Build Docker image using multi-stage Dockerfile
      - name: Build Docker image
        working-directory: ./Todos.Api
        run: |
          docker build -t todos-api .

      - name: Tag Docker image
        run: |
          docker tag todos-api:latest ${{ env.AWS_ACCOUNT_ID }}.dkr.ecr.eu-central-1.amazonaws.com/todos-api:latest
          docker tag todos-api:latest ${{ env.AWS_ACCOUNT_ID }}.dkr.ecr.eu-central-1.amazonaws.com/todos-api:${{ github.sha }}

      # Step 5: Push Docker image to AWS ECR
      - name: Push Docker image
        run: |
          docker push ${{ env.AWS_ACCOUNT_ID }}.dkr.ecr.eu-central-1.amazonaws.com/todos-api:latest
          docker push ${{ env.AWS_ACCOUNT_ID }}.dkr.ecr.eu-central-1.amazonaws.com/todos-api:${{ github.sha }}

      # Step 6: Deploy the application to AWS App Runner
      - name: Deploy to AWS App Runner
        run: |
          aws apprunner start-deployment --service-arn ${{ env.SERVICE_ARN }}
```

5. Save the file and close the text editor.
6. Commit the changes to the repository:

```bash
git add .
git commit -m "Add deployment step to the GitHub Actions workflow"
git push
```

7. Navigate to the `Actions` tab in your GitHub repository to see the workflow running.
8. Once the workflow is completed, navigate to the AWS App Runner console to see the deployment status.
9. Verify that the app still works by navigating to `{{DEFAULT_URL}}/api/ping` in your browser.
10. Update your app, for example, change the response message in the `PingController` and push the changes to the `main` branch.
11. Wait for the GitHub Actions workflow to complete.
12. Wait for the AWS App Runner deployment to complete.
13. Check that your change is reflected in the app by navigating to `{{DEFAULT_URL}}/api/ping` in your browser.

## Summary

In this exercise, you automated the deployment of the Todos.Api project to AWS App Runner using GitHub Actions. The workflow triggers on every push to the `main` branch, builds and pushes the Docker image to AWS ECR, and deploys the application to AWS App Runner. This automation allows you to focus on developing your application while the deployment process is handled automatically.
