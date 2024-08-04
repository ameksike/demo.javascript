// https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
// "ServerResponse" "IncomingMessage"
const http = require('http');
const router = require('./sse.router');
const url = require('url');
const { URLSearchParams } = require('url');

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  try {
    mwResJSON(res);
    mwReqParseURL(req);
    await mwReqParseBody(req);

    let controller = router[req.pathname] || router["404"];
    controller instanceof Function && controller(req, res);
  }
  catch (error) {
    console.log(error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(error.message);
  }
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// middlewares 
function mwReqParseURL(req) {
  const parsedUrl = url.parse(req.url, true);
  req.query = parsedUrl.query;
  req.pathname = parsedUrl.pathname;
  return req;
}

function mwReqParseBody(req) {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
      return resolve(req);
    }
    let contentType = req.headers['content-type'];
    if (contentType?.startsWith('multipart/form-data')) {
      // Extract boundary string from content-type header
      const boundary = req.headers['content-type'].split('boundary=')[1];
      // Initialize variables to store form data
      let formData = {};
      let currentFieldName = '';
      let currentFieldValue = '';
      // Listen for data chunks
      req.on('data', (chunk) => {
        const data = chunk.toString();
        // Split data by boundary
        const parts = data.split(`--${boundary}`);
        // Loop through parts
        for (let part of parts) {
          // Remove leading and trailing whitespaces
          part = part.trim();
          // Skip empty parts
          if (part === '') continue;
          // Check if part is a form field or a file
          if (part.startsWith('Content-Disposition')) {
            // Extract field name from content-disposition header
            //const match = part.match(/name="(.*)"[\r|\n]*(.*)/);
            const match = part.match(/name="([^"]*)"[\r|\n|\s|;]*(.*)/)
            if (match) {
              formData[match[1]] = match[2];
              if (part.includes("filename=")) {
                currentFieldName = match[1];
                currentFieldValue = '';
                let tmp = part.split("\r\n\r\n");
                tmp[1] && (currentFieldValue += tmp[1]);
              }
            }
          } else if (part.startsWith('Content-Type')) {
            // This part is a file, handle it as needed
            // Here you can save the file to disk or process its contents
          } else {
            // This part is a form field value
            currentFieldValue += part;
          }
        }
        currentFieldValue && (formData[currentFieldName] = currentFieldValue);
      });
      // Listen for end of request
      req.on('end', () => {
        // Store the last form field
        // formData[currentFieldName] = currentFieldValue;
        // Process the form data
        req.body = formData;
        resolve(req);
      });
    }
    else {
      let body = '';
      // RAW JSON data 
      // Listen for data chunks
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      // Listen for end of request
      req.on('end', () => {
        if (contentType?.startsWith("application/x-www-form-urlencoded")) {
          req.body = parseURLParams(body);
        } else if (contentType === "application/json") {
          req.body = decode(body);
        } else {
          req.body = body;
        }
        resolve(req);
      });
    }
  })
}

function mwResJSON(res, option) {
  const { status = 200, type } = option || {};
  res.send = (data) => {
    if (typeof data === "object") {
      res.writeHead(status, { 'Content-Type': type || 'application/json' });
      data = encode(data);
    } else {
      res.writeHead(status, { 'Content-Type': type || 'text/html' });
    }
    res.end(data);
  }
}

// utilities 
function encode(data) {
  try {
    if (typeof data === "string") {
      return data;
    } else {
      return JSON.stringify(data);
    }
  }
  catch (_) {
    return data;
  }
}

function decode(data) {
  try {
    if (typeof data !== "string") {
      return data;
    } else {
      return JSON.parse(data);
    }
  }
  catch (_) {
    return data;
  }
}

function parseURLParams(urlString) {
  const params = new URLSearchParams(urlString);
  const queryParams = {};
  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
}



