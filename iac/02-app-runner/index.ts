import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// List of usernames for IAM users
const usernames = ["user1"];

// Store outputs for exporting later
const serviceOutputs: { [key: string]: pulumi.Output<string> } = {};

const stackName = "organization/docker-training-ecr/dev"; // Replace with the correct stack name
const stackReference = new pulumi.StackReference(stackName);

const stackOutputs = stackReference.getOutput("outputs");

// Create a generic IAM Role for App Runner
const appRunnerRole = new aws.iam.Role("appRunnerRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          Service: "build.apprunner.amazonaws.com",
        },
        Action: "sts:AssumeRole",
      },
    ],
  }),
});

// Attach the necessary permissions for App Runner to interact with ECR
new aws.iam.RolePolicy("appRunnerRolePolicy", {
  role: appRunnerRole.id,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetAuthorizationToken",
        ],
        Resource: "*",
      },
    ],
  }),
});

for (const username of usernames) {
  const ecrRepoUrl = stackOutputs.apply(
    (outputs) => outputs[`${username}-repo-uri`]
  );

  // Create an App Runner service
  const appRunnerService = new aws.apprunner.Service(`${username}-app-runner`, {
    serviceName: `${username}-app-runner`,
    sourceConfiguration: {
      imageRepository: {
        imageIdentifier: pulumi.interpolate`${ecrRepoUrl}:latest`,
        imageRepositoryType: "ECR",
        imageConfiguration: {
          port: "3000",
        },
      },
      authenticationConfiguration: {
        accessRoleArn: appRunnerRole.arn,
      },
    },
  });

  serviceOutputs[`${username}-app-runner-url`] = appRunnerService.serviceUrl;
}

export const outputs = serviceOutputs;
