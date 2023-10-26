import { Elysia } from "elysia";
import { wordController } from "./WordController";

const app = new Elysia();
app.use(wordController);

app.listen(3000);


// create sns listener/sub
//
// TODO: create sqs polling fn


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
