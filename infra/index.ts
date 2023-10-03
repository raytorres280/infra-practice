import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { ApiArgs } from "@pulumi/aws/apigatewayv2";
import { DeploymentArgs, RestApi, RestApiArgs } from "@pulumi/aws/apigateway";
import { TopicSubscriptionArgs } from "@pulumi/aws/sns";
import * as apigateway from "@pulumi/aws-apigateway";
import * as crypto from "crypto";

// const loadBalancer = new aws.elb.LoadBalancer("todoApiLoadBalancer", {
//   listeners: [
//     {
//       instancePort: 1,
//       instanceProtocol: "",
//       lbPort: 1,
//       lbProtocol: "" 
//     }
//   ]
// })

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

// const todoApiLoadBalancer = new aws.elb.LoadBalancer("todoApiLoadBalancer", {
//   listeners: []
// })

// const exampleKey = new aws.kms.Key("exampleKey", {
//   description: "example",
//   deletionWindowInDays: 7,
// });
// const exampleLogGroup = new aws.cloudwatch.LogGroup("exampleLogGroup", {});
// const cluster = new aws.ecs.Cluster("todoApiCluster", {configuration: {
//   executeCommandConfiguration: {
//       kmsKeyId: exampleKey.arn,
//       logging: "OVERRIDE",
//       logConfiguration: {
//           cloudWatchEncryptionEnabled: true,
//           cloudWatchLogGroupName: exampleLogGroup.name,
//       },
//   },
// }});


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

// const gatewayEasy = new apigateway.RestAPI("todo-api-awsx", {
//   routes: [
//       {
//           path: "/api",
//           target: {
//               type: "http_proxy",
//               uri: "https://www.google.com",
//             },
//       }
      
//   ]
// })

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