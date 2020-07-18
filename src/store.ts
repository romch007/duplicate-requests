import Keyv from "keyv";

/**
 * Store options
 * @param expiration - TTL of the request, in milliseconds
 * @param connectionUri - Optional connection URI
 */
export type StoreOptions = {
  expiration?: number;
  connectionUri?: string;
};

/**
 * The request object
 * @param id - The unique id sent by client
 * @param sucess - If the request is sucessfull
 * @param emittedAt - When the request is emitted
 */
export type Request = {
  id: string;
  success: boolean;
  emittedAt: Date;
};

/**
 * Class wrapper for the keyv instance
 */
export class Store {
  private keyvInstance: Keyv;
  public expiration: number;

  /**
   * Create a Store instance
   * @param options - store options
   */
  constructor(options?: StoreOptions) {
    this.expiration = options?.expiration ?? 1.08e7;
    this.keyvInstance = new Keyv(options?.connectionUri ?? "", {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
      namespace: "duplicate"
    });
  }

  /**
   * Add a request to the store
   * @param id - The request id
   * @param success - If the request is sucessfull
   * @return An empty Promise
   */
  public async addRequest(id: string, success: boolean): Promise<void> {
    const request = {
      id,
      success,
      emittedAt: new Date()
    };

    await this.keyvInstance.set(
      request.id,
      {
        success: request.success,
        emittedAt: request.emittedAt
      },
      this.expiration
    );
  }

  /**
   * Check if a request already exists in store
   * @param id - The request id
   * @return A Promise containing the request or null if the request does not exist
   */
  public async isRequestExists(id: string): Promise<Request | null> {
    const object = await this.keyvInstance.get(id);
    return object as Request;
  }
}
