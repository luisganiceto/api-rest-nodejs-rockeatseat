import { expect, test, beforeAll, afterAll, it, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import { app } from "../src/app";
import request from "supertest";
import { describe } from "node:test";

describe("Rotas de transacoes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close;
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new transaction", async () => {
    const response = await request(app.server).post("/transactions").send({
      title: "TRANSACAO TESTE",
      amount: 5000,
      type: "credit",
    });

    expect((response.statusCode = 201));
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "TRANSACAO TESTE",
        amount: 5000,
        type: "debit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransaction = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransaction.body.transactions).toEqual([
      expect.objectContaining({
        title: "TRANSACAO TESTE",
        amount: -5000,
      }),
    ]);
  });

  it("should be able to get specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "TRANSACAO TESTE",
        amount: 5000,
        type: "debit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransaction = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    const id = listTransaction.body.transactions[0].id;

    console.log(id);

    const getTransaction = await request(app.server)
      .get(`/transactions/${id}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(getTransaction.body.transaction).toEqual(
      expect.objectContaining({
        title: "TRANSACAO TESTE",
        amount: -5000,
      })
    );
  });

  it("should be able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "TRANSACAO UM",
        amount: 3000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "TRANSACAO DOIS",
        amount: 11000,
        type: "credit",
      });

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "TRANSACAO TRES",
        amount: 4000,
        type: "debit",
      });

    const summary = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summary.body.summary).toEqual({
      amount: 10000,
    });
  });
});
