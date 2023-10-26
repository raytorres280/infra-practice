import { PrismaClient } from "@prisma/client";
import { Elysia, t } from "elysia";

interface wordDictUpdatePayload {
  word: string;
}

export const wordController = (app: Elysia) => {
  app.post("/", async ({ body }) => {
    console.log(Bun.env.DATABASE_URL);
    const prisma = new PrismaClient();


    const result = await prisma.wordDictionary.findFirst({

      where: { word: body.word }
    });

    if (result?.id) {

      const updateResult = await prisma.wordDictionary.update({
        where: { id: result.id }
      })
      return updateResult;
    }


    const createResult = await prisma.wordDictionary.create({
  
      data: {
        word: body.word,
        count: 1,
      }
    })

    console.log(createResult);

    return createResult; 
  }, { // validation 
    body: t.Object({
      word: t.String()
    })
  })

}
