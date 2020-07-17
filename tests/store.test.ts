import { Store } from "../src/store";
let store: Store;

const sleep = (seconds: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });

describe("Store", () => {
  beforeAll(() => {
    store = new Store();
  });

  it("should pass if request does not exist", async () => {
    const request = await store.isRequestExists("nonexistent");
    expect(request).toBeFalsy();
  });

  it("should add request to store and detect it", async () => {
    const requestId = "example";
    await store.addRequest(requestId, false);
    const request = store.isRequestExists(requestId);
    expect(request).toBeTruthy();
  });

  it("should expire request", async () => {
    const otherStore: Store = new Store({ expiration: 1000 }); // 1 second
    const requestId = "example";

    await otherStore.addRequest(requestId, false);
    await sleep(1.5);

    const request = await otherStore.isRequestExists(requestId);
    expect(request).toBeFalsy();
  });
});

