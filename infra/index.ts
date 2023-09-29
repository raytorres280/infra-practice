import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { ApiArgs } from "@pulumi/aws/apigatewayv2";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket");

const args: ApiArgs = {
    protocolType: "HTTP"
};

const gateway = new aws.apigatewayv2.Api("todo-api", args);

// Export the name of the bucket
export const bucketName = bucket.id;
