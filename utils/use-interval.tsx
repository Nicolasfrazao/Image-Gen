import { useEffect, useRef } from "react";

/**
 * This hook takes a callback function and an optional delay (in milliseconds)
 * and calls the callback function every `delay` milliseconds.
 *
 * If `delay` is null, the callback function is never called.
 *
 * The hook returns a cleanup function that can be called to stop calling the
 * callback function.
 */
export const useInterval = (callback: () => void, delay: number | null) => {
  /**
   * We use a ref to store the latest version of the callback function. This is
   * necessary because the callback function might be redefined between renders,
   * and we want to make sure we call the latest version of it.
   */
  const savedCallback = useRef<any>(null);

  /**
   * We use an effect to update the ref whenever the callback function changes.
   * This ensures that we always call the latest version of the callback function.
   */
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /**
   * We use another effect to set up and tear down the interval. The effect
   * depends on the `delay` parameter, so it will be re-run whenever `delay`
   * changes.
   */
  useEffect(() => {
    /**
     * This function is called every `delay` milliseconds. It calls the latest
     * version of the callback function.
     */
    function tick() {
      savedCallback.current();
    }

    /**
     * If `delay` is not null, we set up an interval to call the `tick` function
     * every `delay` milliseconds.
     */
    if (delay !== null) {
      const id = setInterval(tick, delay);
      /**
       * We return a cleanup function that can be called to stop calling the
       * callback function.
       */
      return () => clearInterval(id);
    }
  }, [delay]);
};

