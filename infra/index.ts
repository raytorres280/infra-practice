import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { TopicSubscriptionArgs } from "@pulumi/aws/sns";
import * as apiGateway from "./api-gateway";

const todoListUpdateQueue = new aws.sqs.Queue("new_todos_queue");

const todoListUpdateTopic = new aws.sns.Topic("new_todo_topic");
export const topicArn = todoListUpdateTopic.arn
const queuePolicy = new aws.sqs.QueuePolicy("sqsQueuePolicy", {
  policy: pulumi.interpolate`{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${todoListUpdateQueue.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${todoListUpdateTopic.arn}"
        }
      }
    }
  ]
}`,
  queueUrl: todoListUpdateQueue.id 
})


const subArgs: TopicSubscriptionArgs = {
    endpoint: todoListUpdateQueue.arn,
    protocol: "sqs",
    topic: todoListUpdateTopic.arn
} ;
const todoListUpdateSub = new aws.sns.TopicSubscription("new_todo_sqs_sub", subArgs);

apiGateway
