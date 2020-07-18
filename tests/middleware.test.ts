import { parseTimestamp } from "../src/middleware";
import { createAgent } from "./helpers";

describe("Middleware", () => {
  it("should work with propertyName as a string", async () => {
    const agent = createAgent({ property: "id" });

    await agent.get("/?id=test");
    const response = await agent.get("/?id=test");

    expect(response.status).toBe(429);
  });

  it("should work with propertyName as a function", async () => {
    const agent = createAgent({ property: req => String(req.query.example) });

    await agent.get("/?example=test");
    const response = await agent.get("/?example=test");

    expect(response.status).toBe(429);
  });

  it("should set statusCode", async () => {
    const statusCode = 404;

    const agent = createAgent({
      property: "id",
      errorHandling: { statusCode }
    });

    await agent.get("/?id=test");
    const response = await agent.get("/?id=test");

    expect(response.status).toBe(statusCode);
  });

  it("should set json body", async () => {
    const json = { error: true };

    const agent = createAgent({
      property: "id",
      errorHandling: { json }
    });

    await agent.get("/?id=test");
    const response = await agent.get("/?id=test");

    expect(response.body).toStrictEqual(json);
  });
});

describe("Timestamp parser", () => {
  it("should parse milliseconds", () => {
    const result: number = parseTimestamp("3ms");
    expect(result).toBe(3);
  });

  it("should parse seconds", () => {
    const result: number = parseTimestamp("5s");
    expect(result).toBe(5000);
  });

  it("should parse hours", () => {
    const result: number = parseTimestamp("3h");
    expect(result).toBe(1.08e7);
  });

  it("should parse days", () => {
    const result: number = parseTimestamp("4d");
    expect(result).toBe(3.456e8);
  });

  it("should parse weeks", () => {
    const result: number = parseTimestamp("1w");
    expect(result).toBe(6.048e8);
  });

  it("should throw error if timestring is not recognized", () => {
    expect(() => parseTimestamp("dumb")).toThrow();
  });

  it("should throw error if indicator is not recognized", () => {
    expect(() => parseTimestamp("4p")).toThrow();
  });
});
