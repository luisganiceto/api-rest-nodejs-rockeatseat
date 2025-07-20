import fastify from "fastify";
import { env } from "./env";
import { trasactionsRoutes } from "./routes/trasactions";
import cookie from "@fastify/cookie";

const app = fastify();


app.register(cookie)
app.register(trasactionsRoutes, {
  prefix: "transactions",
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server is running on port ${env.PORT}.`);
  });
