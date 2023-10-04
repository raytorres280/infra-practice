import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
// import { ApiArgs } from "@pulumi/aws/apigatewayv2";
import { DeploymentArgs, RestApi, RestApiArgs } from "@pulumi/aws/apigateway";
import { TopicSubscriptionArgs } from "@pulumi/aws/sns";
// import * as apigateway from "@pulumi/aws/apigatewayv2";
import * as crypto from "crypto";
// import { fargateService, url } from "./go-service-ecs"

const goService = new pulumi.StackReference("raytorres280/go-service-container/dev");
const url = goService.getOutput("url");

export const api = new aws.apigatewayv2.Api('MyApi', { 
  protocolType: 'HTTP' 
});

// Integration with Fargate service
export const integration = new aws.apigatewayv2.Integration('MyIntegration', {
  apiId: api.id,
  integrationType: 'HTTP_PROXY',
  integrationUri: url,
  integrationMethod: 'ANY'
});

// Define the route
export const route = new aws.apigatewayv2.Route('MyRoute', {
  apiId: api.id,
  routeKey: 'ANY /',
  target: integration.id.apply(id => `integrations/${id}`)
});

// Initialize the deployment
export const deployment = new aws.apigatewayv2.Deployment('MyDeployment', {
  apiId: api.id
}, { dependsOn: [route] });

// Create a stage
export const stage = new aws.apigatewayv2.Stage('MyStage', {
  apiId: api.id,
  autoDeploy: true,
  deploymentId: deployment.id,
});