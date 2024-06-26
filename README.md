We are far away from the 9P server. We are using this to experiment but
first steps are just writing a simple http server and we will extend it
gradually.

- start the server:
  - run: `zig build && && ./zig-out/bin/http_server`
- and try to get an answer: `curl -v localhost:8000`
