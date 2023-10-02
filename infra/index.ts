import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { ApiArgs } from "@pulumi/aws/apigatewayv2";
import { DeploymentArgs } from "@pulumi/aws/apigateway";
import { TopicSubscriptionArgs } from "@pulumi/aws/sns";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket");

// Export the name of the bucket
export const bucketName = bucket.id;

const args: DeploymentArgs = {
    restApi: "todo-api"
};

const gateway = new aws.apigateway.Deployment("todo-api", args)

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

const todoDb = new aws.rds.Instance("todosDb", {
  allocatedStorage: 10,
  dbName: "mydb",
  engine: "mysql",
  engineVersion: "5.7",
  instanceClass: "db.t3.micro",
  parameterGroupName: "default.mysql5.7",
  password: "root",
  skipFinalSnapshot: true,
  username: "root",
});

// const todoCommonWordDb = new aws.docdb.Cluster