import fastify from "fastify";
import { trasactionsRoutes } from "./routes/trasactions";
import cookie from "@fastify/cookie";

export const app = fastify();

app.register(cookie);
app.register(trasactionsRoutes, {
  prefix: "transactions",
});
