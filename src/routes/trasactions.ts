import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function trasactionsRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    await knex("transactions").insert({
      
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });

    const transaction = await knex("transactions")
      .where("title", title)
      .first();
    console.log(transaction);
    return reply.status(201).send();
  });
}
