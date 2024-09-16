import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";

/**
 * This API endpoint is called by the frontend to poll for the status of an image
 * generation request. The request is passed a query parameter `id` which is the
 * ID of the message that was sent to the DALL-E 2 API.
 *
 * The endpoint first tries to retrieve the message with the given ID from Redis.
 * If the message is not found, it returns a 404 response with a JSON body containing
 * an error message.
 *
 * If the message is found, it returns a 200 response with the message as the JSON
 * body.
 *
 * If there is an error of any kind, it returns a 500 response with a JSON body
 * containing the error message.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id }: any = req.query;

  try {
    /**
     * Try to retrieve the message with the given ID from Redis. The message is
     * stored in Redis as a JSON string, so we need to parse it as JSON.
     */
    const data = await redis.get(id);
    if (!data) {
      /**
       * If the message is not found, return a 404 response with an error message.
       */
      return res.status(404).json({ message: "No data found" });
    } else {
      /**
       * If the message is found, return a 200 response with the message as the
       * JSON body.
       */
      return res.status(200).json(data);
    }
  } catch (error) {
    /**
     * If there is an error of any kind, return a 500 response with an error
     * message.
     */
    return res.status(500).json({ message: error.message });
  }
}

