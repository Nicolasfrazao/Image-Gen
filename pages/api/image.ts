import { NextApiRequest, NextApiResponse } from "next";

// These are the URLs we'll be interacting with
const QSTASH = `https://qstash.upstash.io/v1/publish/`;
const DALL_E = "https://api.openai.com/v1/images/generations";
const VERCEL_URL = "https://dalle-2-jade.vercel.app";

// These are the environment variables we expect to be set
require('dotenv').config()

// Get the environment variables
const qstash = process.env.QSTASH_TOKEN
const openai = process.env.OPENAI_API_KEY

// Print the environment variables to the console
console.log(qstash, openai);

// If either of the environment variables is missing, throw an error
if (!qstash) {
  throw new Error("QSTASH_TOKEN is not set");
}

if (!openai) {
  throw new Error("OPENAI_API_KEY is not set");
}

// This is the handler for the API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the prompt from the query string
  const { prompt } = req.query;

  try {
    // Make a POST request to the QStash URL with the prompt and some other options
    const response = await fetch(`${QSTASH + DALL_E}`, {
      method: "POST",
      // Set the Authorization header to the QStash token
      headers: {
        Authorization: `Bearer ${qstash}`,
        // Set the Upstash-Forward-Authorization header to the OpenAI API key
        "upstash-forward-Authorization": `Bearer ${openai}`,
        // Set the Content-Type header to application/json
        "Content-Type": "application/json",
        // Set the Upstash-Callback header to the URL of the callback function
        "Upstash-Callback": `${VERCEL_URL}/api/callback`,
      },
      // Set the body of the request to a JSON object with the prompt and some other options
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      }),
    });

    // Get the JSON response from the request
    const json = await response.json();

    // Return a 202 response with the message ID from the response
    return res.status(202).json({ id: json.messageId });
  } catch (error) {
    // If there's an error, return a 500 response with the error message
    return res
      .status(500)
      .json({ message: error.message, type: "Internal server error" });
  }
}

