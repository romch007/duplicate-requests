import Keyv from "keyv";

export type Options = {
  expiration?: number;
};

export type Request = {
  id: string;
  success: boolean;
  emittedAt: Date;
};

export class Store {
  private keyvInstance: Keyv;
  public expiration: number;

  constructor(options?: Options) {
    this.expiration = options?.expiration ?? 1.08e7;
    this.keyvInstance = new Keyv({
      serialize: JSON.stringify,
      deserialize: JSON.parse
    });
  }

  async addRequest(id: string, success: boolean): Promise<void> {
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

  async isRequestExists(id: string): Promise<Request | null> {
    const object = await this.keyvInstance.get(id);
    return object as Request;
  }
}
