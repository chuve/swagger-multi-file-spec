# Example of Swagger UI with Externally Defined Components in Swagger spec

This repo shows you how to create OpenAPI Object (Swagger spec) with using a $ref references to external definitions and launch Swagger UI with [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express).

## TL;DR

Check the [index.js](https://github.com/chuve/swagger-multi-file-spec/blob/master/index.js) file and copy and reuse multiFileSwagger function in your code.

If you want to launch the example do next steps:

- `yarn install` - install dependencies
- `yarn run start` - run server (be sure that port 9000 is not busy on you local machine or change it :))
- [http://localhost:9000/api/doc/](http://localhost:9000/api/doc/) - open link in browser

### This repo shows you how you can resolve the  `Resolver error` in Swagger UI

> **Q:** I'm trying split my OpenAPI Object over multiple YAML files, but I get the erorr: `Resolver error. Could not resolve reference: Tried to resolve a relative URL, without having a basePath.`
![Resolver error. Could not resolve reference: Tried to resolve a relative URL, without having a basePath.](https://github.com/chuve/swagger-multi-file-spec/blob/master/screenshots/issue.png)

> **A:** You have to resolve references in your YAML files by your self first, and provide result to Swagger UI then.
> You can do it with [json-refs](https://www.npmjs.com/package/json-refs) and [yamljs](https://www.npmjs.com/package/yamljs) libraries.

Here is the code snippet below shows you how you can do it:

```javascript
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

  const swaggerDocument = await multiFileSwagger(
    yamljs.load(path.resolve(__dirname, "./openapi/v1.yaml"))
  );
};
```

If you want to know more about how it works, check the documenation of [resolveRefs](https://github.com/whitlockjc/json-refs/blob/master/docs/API.md#module_json-refs.resolveRefs) function.

### Useful links

- [How to split a Swagger spec into smaller files](https://azimi.me/2015/07/16/split-swagger-into-smaller-files.html)
- [Multi-file Swagger example](https://github.com/mohsen1/multi-file-swagger-example)

#### License

MIT
