import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as docker from "@pulumi/docker";
import { todoDb } from "./todo-service-database";

// const dbConnectionString = todoDb.address

const config = new pulumi.Config();
const containerPort = config.getNumber("containerPort") || 80;
const cpu = config.getNumber("cpu") || 512;
const memory = config.getNumber("memory") || 128;

// An ECS cluster to deploy into
const cluster = new aws.ecs.Cluster("cluster", {});

// An ALB to serve the container endpoint to the internet
const loadbalancer = new awsx.lb.ApplicationLoadBalancer("loadbalancer", {
    defaultTargetGroup: {
        healthCheck: {
            path: '/health'
        }
    }
});
loadbalancer.defaultTargetGroup.healthCheck
// An ECR repository to store our application's container image
const repo = new awsx.ecr.Repository("repo", {
    forceDelete: true,
});

// const image = new docker.Image

// Build and publish our application's container image from ./app to the ECR repository
const image = new awsx.ecr.Image("image", {
    repositoryUrl: repo.url,
    path: "./app",
    extraOptions: ['--platform', 'linux/amd64']
});

// Create a new CloudWatch log group
const logGroup = new aws.cloudwatch.LogGroup("fargateLogGroup");


// Deploy an ECS Service on Fargate to host the application container
const fargateService = new awsx.ecs.FargateService("goServiceFargate", {
    cluster: cluster.arn,
    assignPublicIp: true,
    taskDefinitionArgs: {
        container: {
            name: "todoApi",
            image: image.imageUri,
            environment: [
                {
                    name: "RDS_CONNECTION_STRING",
                    value: pulumi.interpolate`${todoDb.username}:${todoDb.password}@tcp(${todoDb.endpoint})/${todoDb.dbName}`
                }
            ],
            cpu: cpu,
            memory: memory,
            essential: true,
            portMappings: [{
                containerPort: containerPort,
                targetGroup: loadbalancer.defaultTargetGroup,
            }],
            logConfiguration: {
                logDriver: "awslogs",
                options: {
                    "awslogs-region": aws.config.region,
                    "awslogs-group": logGroup.name, // Use the new CloudWatch log group
                    "awslogs-stream-prefix": "Fargate",
                },
            },
        },
    },
});
// The URL at which the container's HTTP endpoint will be available
export const url = pulumi.interpolate`http://${loadbalancer.loadBalancer.dnsName}`;
