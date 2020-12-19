const http = require("http");
const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const resolveRefs = require("json-refs").resolveRefs;

/**
 * Return JSON with resolved references
 * @param {array | object} root - The structure to find JSON References within (Swagger spec)
 * @returns {Promise.<JSON>}
 */
const multiFileSwagger = (root) => {
  const options = {
    filter: ["relative", "remote"],
    loaderOptions: {
      processContent: function (res, callback) {
        callback(null, yamljs.parse(res.text));
      },
    },
  };

  return resolveRefs(root, options).then(
    function (results) {
      return results.resolved;
    },
    function (err) {
      console.log(err.stack);
    }
  );
};

const createServer = async () => {
  const app = express();

  const swaggerDocument = await multiFileSwagger(
    yamljs.load(path.resolve(__dirname, "./openapi/v1.yaml"))
  );

  app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const server = http.createServer(app);

  return server;
};

createServer()
  .then((server) => {
    const port = 9000;
    server.listen(port);
    console.log(`[API] Webhook is running on port ${port}`);
    console.log(`[API] Swagger UI available with path: /api/doc`);
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
