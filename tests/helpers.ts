import { createMiddleware, MiddlewareOptions } from "../src/middleware";
import supertest, { SuperAgentTest } from "supertest";
import express from "express";

export const createAgent = (options: MiddlewareOptions): SuperAgentTest => {
  const app = express();
  app.use(createMiddleware(options));
  app.get("/", (_, res) => res.json({ success: true }));
  return supertest.agent(app);
};
