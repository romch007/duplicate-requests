# duplicate-requests

This middleware aims to avoid duplicated requests made the client, due to lack of network, or nervous and frustrated endless cliking.

Assuming the client send an unique id with every request (not duplicated requests), the middleware will send an error or resend the content of the previous request if a request already arrived have the same id.

## Usage :

```javascript
import duplicate from "duplicate-requests";
// or
const duplicate = require("duplicate-requests").default;

const express = require("express");
const app = express();

app.use(duplicate({
    expiration: "2h",
    property: "id"
}));

app.get("/", (req, res) => res.end("Hey!"));

app.listen(8080, () => console.log("Listening!"));
```

### Options

```javascript
{
  expiration: "2h", /* Expiration time of the request in memory
                     * should be an int followed by ms, s, m, h, d, w,
                     */
  property: "id", /* Property which contains the id
                   * should be a string or a function 
                   * with a req paramater which returns a string
                   */
  prefix: "article.add", // Prefix to group requests in storage
  errorHandling: {
    statusCode: 429, // The status code to send if request is duplicated
    json: {} // Javascript plain object to send if request is duplicated
  },
  connectionUri: "" // Leave empty to store object in memory, or use redis:// or mongodb://
}
```

### External storage

If you want to use an external storage (currently supported are Redis and MongoDB), you need to install one of the following package :

```bash
npm install --save @keyv/mongo
npm install --save @keyv/redis
```

## Todo

- [x] Custom error

- [ ] Parameter to cache request and don't send error

- [x] Timestamp parser (`1d`, `3h`)

- [x] Pick id from body

- [x] Integration test for middleware
