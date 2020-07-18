import { Request, Response, NextFunction } from "express";
import { Store } from "./store";

/**
 * Type for the timestamp parsing
 */
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
 * Type for middleware function used by express
 * @param req - The request object
 * @param req - The response object
 * @param next - The next function
 * @return An empty Promise, to support async/await
 */
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Error handling options
 * @param json - Javascript plain object to send to client if request is duplicated
 * @param statusCodes - Status code to send to the client if request is duplicated
 */
export type ErrorHandlingOptions = {
  json?: unknown;
  statusCode?: number;
};

/**
 * Property picker
 */
export type PropertyPicker =
  /**
   * @param req - The request object
   * @return The id
   */

  (req: Request) => string;

/**
 * Middleware options passing at creation
 * @param expiration - TTL of requests
 * @param errorHandling - Error handling configuration
 * @param property - Way to get the id property
 */
export type MiddlewareOptions = {
  expiration?: string;
  errorHandling?: ErrorHandlingOptions;
  property: string | PropertyPicker;
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
 * @param options - Middleware options
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
    // If options.property is a function, gets is return value
    const id: string =
      typeof options.property === "function"
        ? options.property(req)
        : String(req.query[options.property]);

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
      // Don't wait for addRequest to finish, no await
      store.addRequest(id, false);
      next();
    }
  };

  return middlewareFunction;
}
