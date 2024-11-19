import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Wrap everything in an async function to use await
export = async () => {
  const stackName = "organization/docker-training-ecr/dev"; // Replace with the correct stack name
  const stackReference = new pulumi.StackReference(stackName);

  const outputs = stackReference.getOutput("outputs");

  // Create an ECS cluster for Fargate
  const cluster = new aws.ecs.Cluster("customCluster", {
    name: "custom-cluster",
  });

  // Get the default VPC
  const defaultVpc = await aws.ec2.getVpc({ default: true });

  // Create a Security Group to allow HTTP access
  const securityGroup = new aws.ec2.SecurityGroup("customSecurityGroup", {
    description: "Allow HTTP traffic",
    vpcId: defaultVpc.id,
    ingress: [
      {
        protocol: "tcp",
        fromPort: 80,
        toPort: 80,
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
    egress: [
      {
        protocol: "-1", // Allow all outbound traffic
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
  });

  // Define the task execution role to allow ECS to pull from ECR
  const taskExecutionRole = new aws.iam.Role("taskExecutionRole", {
    assumeRolePolicy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: "ecs-tasks.amazonaws.com",
          },
          Action: "sts:AssumeRole",
        },
      ],
    }),
  });

  // Attach the AmazonECSTaskExecutionRolePolicy to the task role
  new aws.iam.RolePolicyAttachment("taskExecutionRolePolicyAttachment", {
    role: taskExecutionRole.name,
    policyArn:
      "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  });

  // Attach additional policy to allow the role to pull images from Amazon ECR
  new aws.iam.RolePolicy("ecrAccessPolicy", {
    role: taskExecutionRole.id,
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

  // Get the default VPC subnets
  const defaultVpcSubnets = await aws.ec2.getSubnets({
    filters: [{ name: "vpc-id", values: [defaultVpc.id] }],
  });

  // Create an Application Load Balancer (ALB)
  const alb = new aws.lb.LoadBalancer("customAlb", {
    internal: false,
    securityGroups: [securityGroup.id],
    subnets: defaultVpcSubnets.ids,
  });

  // Create a default Target Group for unmatched requests
  const defaultTargetGroup = new aws.lb.TargetGroup("defaultTargetGroup", {
    port: 80,
    protocol: "HTTP",
    targetType: "ip",
    vpcId: defaultVpc.id,
  });

  // Create a Listener for the ALB
  const listener = new aws.lb.Listener("customListener", {
    loadBalancerArn: alb.arn,
    port: 80,
    defaultActions: [
      {
        type: "forward",
        targetGroupArn: defaultTargetGroup.arn,
      },
    ],
  });

  const usernames = ["user1"];

  for (const user of usernames) {
    const repositoryUrl = outputs.apply(
      (outputs) => outputs[`${user}-repo-uri`]
    );

    // Define the Fargate task definition for running the custom image
    const taskDefinition = new aws.ecs.TaskDefinition(`${user}TaskDefinition`, {
      family: `${user}-task`,
      cpu: "256",
      memory: "512",
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
      executionRoleArn: taskExecutionRole.arn,
      containerDefinitions: pulumi.interpolate`[{
          "name": "${user}-container",
          "image": "${repositoryUrl}:latest",
          "essential": true,
          "portMappings": [{
            "containerPort": 3000,
            "protocol": "tcp"
          }]
        }]`,
    });

    // Create a Target Group for each user's service
    const targetGroup = new aws.lb.TargetGroup(`${user}TargetGroup`, {
      port: 3000,
      protocol: "HTTP",
      targetType: "ip",
      vpcId: defaultVpc.id,
    });

    // Add a rule to forward traffic for each user to their respective target group
    new aws.lb.ListenerRule(`${user}ListenerRule`, {
      listenerArn: listener.arn,
      actions: [
        {
          type: "forward",
          targetGroupArn: targetGroup.arn,
        },
      ],
      conditions: [
        {
          pathPattern: {
            values: [`/${user}/*`],
          },
        },
      ],
    });

    // Create an ECS service to run the task definition on Fargate, connected to the ALB
    new aws.ecs.Service(`${user}Service`, {
      cluster: cluster.arn,
      desiredCount: 1,
      launchType: "FARGATE",
      taskDefinition: taskDefinition.arn,
      networkConfiguration: {
        subnets: defaultVpcSubnets.ids,
        securityGroups: [securityGroup.id],
        assignPublicIp: true,
      },
      loadBalancers: [
        {
          targetGroupArn: targetGroup.arn,
          containerName: `${user}-container`,
          containerPort: 3000,
        },
      ],
    });
  }

  // Export the DNS name of the Load Balancer
  return {
    albDnsName: alb.dnsName,
  };
};
