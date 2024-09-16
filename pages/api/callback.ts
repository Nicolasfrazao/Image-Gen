import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";

/**
 * This API endpoint is called by QStash after it receives a message from the
 * OpenAI DALL-E 2 API. The message is encoded in base64, so we need to decode
 * it before we can store it in Redis. We store the decoded message in Redis
 * with the sourceMessageId as the key. This allows us to retrieve the message
 * later when the user polls our API to see if the image has been generated.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  try {
    /**
     * The request body is a JSON object with two properties:
     * - `body`: The base64 encoded message from the OpenAI API
     * - `sourceMessageId`: The ID of the message that was sent to the OpenAI API
     */
    const decoded = atob(body.body);
    /**
     * We store the decoded message in Redis with the sourceMessageId as the key.
     * This allows us to retrieve the message later when the user polls our API
     * to see if the image has been generated.
     */
    await redis.set(body.sourceMessageId, decoded);
    /**
     * We return a 200 response with the decoded message as the response body.
     * This is just a sanity check to make sure that the message was properly
     * decoded and stored in Redis.
     */
    return res.status(200).send(decoded);
  } catch (error) {
    /**
     * If there is an error, we return a 500 response with the error message as
     * the response body.
     */
    return res.status(500).json({ error });
  }
}

