import { Store } from "../src/store";

describe("Adaptaters", () => {
  it("should work with mongodb", async () => {
    const store = new Store({ connectionUri: process.env.MONGO_URI });
    const id = "example";
    await store.addRequest(id, true);
    expect(await store.isRequestExists(id)).toBeDefined();
  });
});
