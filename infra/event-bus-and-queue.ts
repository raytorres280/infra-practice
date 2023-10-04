import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { ApiArgs } from "@pulumi/aws/apigatewayv2";
import { DeploymentArgs, RestApi, RestApiArgs } from "@pulumi/aws/apigateway";
import { TopicSubscriptionArgs } from "@pulumi/aws/sns";
import * as apigateway from "@pulumi/aws-apigateway";
import * as crypto from "crypto";


export const queueSnsSubPolicy = `{
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


export const todoListUpdateQueue = new aws.sqs.Queue("new_todos_queue", { policy: queueSnsSubPolicy });

export const todoListUpdateTopic = new aws.sns.Topic("new_todo_topic");

const subArgs: TopicSubscriptionArgs = {
    endpoint: todoListUpdateQueue.arn,
    protocol: "sqs",
    topic: todoListUpdateTopic.arn
} ;
export const todoListUpdateSub = new aws.sns.TopicSubscription("new_todo_sqs_sub", subArgs);