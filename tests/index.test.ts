import createMiddleware from "../src/";

it("should export function", () => {
  expect(createMiddleware).toBeTruthy();
  expect(typeof createMiddleware).toMatch("function");
});
