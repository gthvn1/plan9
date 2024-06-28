- We are far away from the 9P server. We are using this to experiment but
first steps are just writing a simple http server and we will extend it
gradually. 

- Currently we are more playing with 🥳 Zig, JS and WASM 🥳 as you can see
in [html_contents/](https://github.com/gthvn1/plan9/tree/master/html_contents).
- And in the same time in this repo we are implementing a server in Zig 🛠️... 

- So right now nothing is related to plan9 but fun things
  - start the server:
    - run: `zig build && && ./zig-out/bin/http_server`
  - and try to get an answer: `curl -v localhost:8000`
