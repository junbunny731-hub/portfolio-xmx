const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.argv[2] || 5294);
const root = __dirname;
const host = "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${host}:${port}`);
  const requestedPath = decodeURIComponent(url.pathname);
  let filePath = path.normalize(
    path.join(root, requestedPath === "/" ? "index.html" : requestedPath)
  );

  if (!filePath.startsWith(root)) {
    response.writeHead(403, { "Content-Type": "text/plain" });
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    } else if (path.extname(filePath) === "") {
      const indexPath = path.join(filePath, "index.html");
      if (fs.existsSync(indexPath)) filePath = indexPath;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type":
          types[path.extname(filePath).toLowerCase()] ||
          "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(content);
    });
  });
});

server.on("clientError", (_error, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(port, host, () => {
  console.log(`Stable preview running at http://${host}:${port}/`);
});
