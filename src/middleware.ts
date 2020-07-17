import { Request, Response, NextFunction } from "express";
import { Store } from "./store";

let store: Store;

export function createMiddleware(
  expiration: number,
  propertyName: string
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  store = new Store({ expiration });

  const middlewareFunction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = String(req.query[propertyName]);
    const alreadyExists = await store.isRequestExists(id);
    if (alreadyExists) {
      res
        .status(429)
        .json({ success: false, info: {}, error: "Request already sent" });
    } else {
      await store.addRequest(id, false);
      next();
    }
  };

  return middlewareFunction;
}
