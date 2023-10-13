import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { TopicSubscriptionArgs } from "@pulumi/aws/sns";
import * as apiGateway from "./api-gateway";

// const queueSnsSubPolicy = `{
//     "Statement": [
//       {
//         "Effect": "Allow",
//         "Principal": {
//           "Service": "sns.amazonaws.com"
//         },
//         "Action": "sqs:SendMessage",
//         "Resource": "arn:aws:sqs:us-east-2:123456789012:MyQueue",
//         "Condition": {
//           "ArnEquals": {
//             "aws:SourceArn": "arn:aws:sns:us-east-2:123456789012:MyTopic"
//           }
//         }
//       }
//     ]
//   }`

// let snsPolicy = aws.iam.getPolicyDocument();

const todoListUpdateQueue = new aws.sqs.Queue("new_todos_queue");

const todoListUpdateTopic = new aws.sns.Topic("new_todo_topic");

const subArgs: TopicSubscriptionArgs = {
    endpoint: todoListUpdateQueue.arn,
    protocol: "sqs",
    topic: todoListUpdateTopic.arn
} ;
const todoListUpdateSub = new aws.sns.TopicSubscription("new_todo_sqs_sub", subArgs);

apiGateway