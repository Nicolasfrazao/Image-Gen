import type { NextApiResponse } from "next";
import LRU from "lru-cache";

/**
 * rateLimit is a function that returns an object with a single method, check.
 * The check method takes in a NextApiResponse object, a limit (i.e. the maximum
 * number of requests allowed in the given time interval), and a token (i.e. the
 * unique identifier for the user or IP address making the request).
 *
 * The check method returns a Promise that resolves if the request is within the
 * rate limit, and rejects if the request is rate limited.
 *
 * The function takes an optional options object with two properties:
 * uniqueTokenPerInterval: the maximum number of unique tokens that can be stored
 * in the LRU cache at any given time. Defaults to 500.
 * interval: the time to live (in milliseconds) for each token in the LRU cache.
 * Defaults to 60000 (1 minute).
 */
export default function rateLimit(options?: {
  /**
   * The maximum number of unique tokens that can be stored in the LRU cache at
   * any given time.
   */
  uniqueTokenPerInterval?: number;
  /**
   * The time to live (in milliseconds) for each token in the LRU cache.
   */
  interval?: number;
}) {
  /**
   * The LRU cache object that stores the count of requests for each unique token.
   */
  const tokenCache = new LRU({
    /**
     * The maximum number of unique tokens that can be stored in the LRU cache at
     * any given time.
     */
    max: options?.uniqueTokenPerInterval || 500,
    /**
     * The time to live (in milliseconds) for each token in the LRU cache.
     */
    ttl: options?.interval || 60000,
  });

  /**
   * The check method takes in a NextApiResponse object, a limit (i.e. the maximum
   * number of requests allowed in the given time interval), and a token (i.e. the
   * unique identifier for the user or IP address making the request).
   */
  return {
    check: (
      res: NextApiResponse,
      limit: number,
      token: string
    ): Promise<void> => {
      /**
       * Get the current count of requests for the given token from the LRU cache.
       * If the token is not in the cache, set the count to 0.
       */
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      /**
       * If the count is 0, set the count to 1 and store it in the LRU cache.
       */
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      /**
       * Increment the count by 1.
       */
      tokenCount[0] += 1;

      /**
       * Get the current usage (i.e. the number of requests in the given time
       * interval).
       */
      const currentUsage = tokenCount[0];
      /**
       * Check if the request is rate limited.
       */
      const isRateLimited = currentUsage >= limit;
      /**
       * Set the X-RateLimit-Limit and X-RateLimit-Remaining headers on the
       * response object.
       */
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader(
        "X-RateLimit-Remaining",
        isRateLimited ? 0 : limit - currentUsage
      );

      /**
       * Return a Promise that resolves if the request is within the rate limit,
       * and rejects if the request is rate limited.
       */
      return isRateLimited ? Promise.reject() : Promise.resolve();
    },
  };
}

