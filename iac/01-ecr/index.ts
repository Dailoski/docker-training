import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// List of usernames for IAM users
const usernames = ["user1"];

// Store outputs for exporting later
const repoOutputs: { [key: string]: pulumi.Output<string> } = {};

for (const username of usernames) {
  // Create a dedicated ECR repository for the user
  const ecrRepo = new aws.ecr.Repository(`${username}-repo`, {
    name: `${username}-repo`,
  });

  // Create IAM policy for the specific repository
  const ecrPolicy = new aws.iam.Policy(`${username}-policy`, {
    description: `Policy for ${username} to access their ECR repository`,
    policy: pulumi.interpolate`{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "ecr:GetDownloadUrlForLayer",
                        "ecr:BatchGetImage",
                        "ecr:BatchCheckLayerAvailability",
                        "ecr:PutImage",
                        "ecr:InitiateLayerUpload",
                        "ecr:UploadLayerPart",
                        "ecr:CompleteLayerUpload",
                        "ecr:GetAuthorizationToken"
                    ],
                    "Resource": "arn:aws:ecr:*:${ecrRepo.registryId}:repository/${username}-repo"
                },
                {
                    "Effect": "Allow",
                    "Action": "ecr:GetAuthorizationToken",
                    "Resource": "*"
                }
            ]
        }`,
  });

  // Create an IAM user
  const iamUser = new aws.iam.User(`${username}-user`, {
    name: username,
  });

  // Attach the policy to the IAM user
  new aws.iam.UserPolicyAttachment(`${username}-policy-attachment`, {
    user: iamUser.name,
    policyArn: ecrPolicy.arn,
  });

  // Create an access key for the user
  const accessKey = new aws.iam.AccessKey(`${username}-access-key`, {
    user: iamUser.name,
  });

  // Export the repository URI and user credentials
  repoOutputs[`${username}-repo-uri`] = ecrRepo.repositoryUrl;
  repoOutputs[`${username}-access-key-id`] = accessKey.id;
  repoOutputs[`${username}-secret-access-key`] = accessKey.secret;
}

export const outputs = repoOutputs;
