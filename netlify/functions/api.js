import app from "../../server/app.js";

export default async (req, res) => {
  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(200).end();
    return;
  }

  // Remove /api prefix from the path if present
  let path = req.url;
  if (path.startsWith("/api/")) {
    path = path.slice(4);
  }

  // Create a mock request object compatible with Express
  const mockReq = {
    ...req,
    url: path,
    path: path,
  };

  return new Promise((resolve) => {
    // Capture the response
    const originalSend = res.send;
    const originalJson = res.json;
    const originalStatus = res.status;
    let statusCode = 200;
    let responseBody = null;

    res.status = function (code) {
      statusCode = code;
      res.statusCode = code;
      return res;
    };

    res.send = function (data) {
      responseBody = data;
      res.statusCode = statusCode;
      resolve({
        statusCode: statusCode,
        body: typeof data === "string" ? data : JSON.stringify(data),
      });
      return res;
    };

    res.json = function (data) {
      responseBody = data;
      res.setHeader("Content-Type", "application/json");
      res.statusCode = statusCode;
      resolve({
        statusCode: statusCode,
        headers: Object.fromEntries(res.getHeaders?.() || []),
        body: JSON.stringify(data),
      });
      return res;
    };

    // Pass through the Express app
    app(mockReq, res);
  });
};
