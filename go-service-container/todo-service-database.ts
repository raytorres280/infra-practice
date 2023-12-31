import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { ApiArgs } from "@pulumi/aws/apigatewayv2";
import { DeploymentArgs, RestApi, RestApiArgs } from "@pulumi/aws/apigateway";
import { TopicSubscriptionArgs } from "@pulumi/aws/sns";


const config = new pulumi.Config();
export const todoDb = new aws.rds.Instance("todos-db", {
  allocatedStorage: 10,
  dbName: "mydb",
  engine: "mysql",
  engineVersion: "5.7",
  instanceClass: "db.t3.micro",
  parameterGroupName: "default.mysql5.7",
  password: config.require("rdsTodoPassword"),
  skipFinalSnapshot: true,
  username: "root",
  publiclyAccessible: true
});

// const environemnt = new Environment


// const todoCommonWordDb = new aws.docdb.Cluster