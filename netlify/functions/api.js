import serverless from "serverless-http";
import app from "../../server/app.js";

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  // Netlify redirects /api/* to /.netlify/functions/api/:splat
  // This causes the event.path to be /.netlify/functions/api/signin
  // But our Express app expects /api/signin
  if (event.path && event.path.startsWith("/.netlify/functions/api")) {
    event.path = event.path.replace("/.netlify/functions/api", "/api");
  }

  return serverlessHandler(event, context);
};
