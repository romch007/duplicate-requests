import { Request, Response, NextFunction } from "express";
import { Store } from "./store";

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type ErrorHandlingOptions = {
  json?: unknown;
  statusCode?: number;
};

export type PropertyPicker = (req: Request) => string;

export type MiddlewareOptions = {
  expiration?: string;
  errorHandling?: ErrorHandlingOptions;
  property: string | PropertyPicker;
};

export type IndicatorsValue = {
  [key: string]: number;
};

const timestampRegexp = /^(\d)((?:ms)|s|m|h|d|w)$/;

const indicatorsValue: IndicatorsValue = {
  ms: 1,
  s: 1000,
  m: 6000,
  h: 3.6e6,
  d: 8.64e7,
  w: 6.048e8
};

/**
 * Parse timestamp string, like 3d or 5ms
 * @param timestring - The timestamp string
 * @return The result in milliseconds
 */
export function parseTimestamp(timestring: string): number {
  const matchResult = timestring.match(timestampRegexp);
  if (!matchResult) {
    throw new Error(`Timestamp string "${timestring}" not recognized`);
  }
  const indicator: string = matchResult[2];
  const value = Number(matchResult[1]);
  const indicatorValue = indicatorsValue[indicator];
  return value * indicatorValue;
}

let store: Store;

/**
 * Generate the middleware function
 * @param expiration - Request expiration in the store
 * @param propertyName - The property in req.query containing the request id
 * @return The middleware function used by express
 */
export function createMiddleware(
  options: MiddlewareOptions
): MiddlewareFunction {
  store = new Store({
    expiration: parseTimestamp(options?.expiration ?? "2h")
  });

  const middlewareFunction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let id: string;
    // If options.property is a function, gets is return value
    if (typeof options.property === "function") {
      id = options.property(req);
    } else {
      id = String(req.query[options.property]);
    }

    const alreadyExists = await store.isRequestExists(id);
    if (alreadyExists) {
      const responseData: unknown = options?.errorHandling?.json ?? {
        success: false,
        info: {},
        error: "Request already sent"
      };
      const statusCode: number = options?.errorHandling?.statusCode ?? 429;

      res.status(statusCode).json(responseData);
    } else {
      store.addRequest(id, false);
      next();
    }
  };

  return middlewareFunction;
}
