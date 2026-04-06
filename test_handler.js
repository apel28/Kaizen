import { handler } from "./netlify/functions/api.js";

const event = {
  httpMethod: "POST",
  path: "/.netlify/functions/api/signin",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({ email: "test@example.com", password: "password" }),
  isBase64Encoded: false,
};

const context = {};

async function test() {
  const result = await handler(event, context);
  console.log("Status:", result.statusCode);
  console.log("Body:", result.body);
}

test();
