import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { ApiArgs } from "@pulumi/aws/apigatewayv2";
import { DeploymentArgs, RestApi, RestApiArgs } from "@pulumi/aws/apigateway";
import { TopicSubscriptionArgs } from "@pulumi/aws/sns";
import * as crypto from "crypto";
// import { RestApiArgs } from "@pulumi/awsx/classic/apigateway";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket");

// Export the name of the bucket
export const bucketName = bucket.id;

// const args: DeploymentArgs = {
//     restApi: "todo-api"
// };

// const gateway = new aws.apigateway.Deployment("todo-api", args)
const apiArgs: RestApiArgs = {
  // routes: []
} 

const gateway = new aws.apigateway.RestApi("todoApi")
const goTodoService = new aws.apigateway.Resource("todoApiService" , {
  parentId: gateway.rootResourceId,
  pathPart: "api",
  restApi: gateway.id
});
const goTodoServiceMethod = new aws.apigateway.Method("goTodoServiceMethod", {
  restApi: gateway.id,
  resourceId: goTodoService.id,
  httpMethod: "ANY",
  authorization: "NONE",
})
// console.log(goTodoServiceMethod.httpMethod)

const integration = new aws.apigateway.Integration("todoApiGoServiceIntegration", {
  httpMethod: goTodoServiceMethod.httpMethod,
  resourceId: goTodoService.id,
  restApi: gateway.id,
  type: "MOCK"
})
const deployment = new aws.apigateway.Deployment("todoApiDeployment", {
  restApi: gateway.id,
  triggers: {
    redeployment: pulumi.all([goTodoService.id, goTodoServiceMethod.id, integration.id])
    .apply(([goTodoServiceId, goTodoServiceMethodId, integrationId]) => JSON.stringify([
        goTodoServiceId,
        goTodoServiceMethodId,
        integrationId,
    ])).apply(toJSON => crypto.createHash('sha1').update(toJSON).digest('hex')),
}})

const devStage = new aws.apigateway.Stage("todoApiDevStage", {
  deployment: deployment.id,
  restApi: gateway.id,
  stageName: "dev",
});

const queueSnsSubPolicy = `{
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "sns.amazonaws.com"
        },
        "Action": "sqs:SendMessage",
        "Resource": "arn:aws:sqs:us-east-2:123456789012:MyQueue",
        "Condition": {
          "ArnEquals": {
            "aws:SourceArn": "arn:aws:sns:us-east-2:123456789012:MyTopic"
          }
        }
      }
    ]
  }`


const todoListUpdateQueue = new aws.sqs.Queue("new_todos_queue", { policy: queueSnsSubPolicy });

const todoListUpdateTopic = new aws.sns.Topic("new_todo_topic");

const subArgs: TopicSubscriptionArgs = {
    endpoint: todoListUpdateQueue.arn,
    protocol: "sqs",
    topic: todoListUpdateTopic.arn
} ;
const todoListUpdateSub = new aws.sns.TopicSubscription("new_todo_sqs_sub", subArgs);

// const todoDb = new aws.rds.Instance("todos-db", {
//   allocatedStorage: 10,
//   dbName: "mydb",
//   engine: "mysql",
//   engineVersion: "5.7",
//   instanceClass: "db.t3.micro",
//   parameterGroupName: "default.mysql5.7",
//   password: "root",
//   skipFinalSnapshot: true,
//   username: "root",
// });

// const todoCommonWordDb = new aws.docdb.Cluster