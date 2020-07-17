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

app.use(duplicate(10000, "id"));

app.get("/", (req, res) => res.end("Hey!"));

app.listen(8080, () => console.log("Listening!"));
```



## Todo

- [ ] Custom error

- [ ] Cache request and don't send error

- [ ] Timestamp parser (`1d`, `3h`)

- [ ] Pick id from body

- [ ] Integration test for middleware


