# duplicated-requests

This middleware aims to avoid duplicated requests made the client, due to lack of network, or nervous and frustrated endless cliking.

Assuming the client send an unique id with every request (not duplicated requests), the middleware will send an error or resend the content of the previous request if a request already arrived have the same id.
