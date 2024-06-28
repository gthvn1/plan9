# Exploring interactions between HTML, JS, ZIG and WASM

- [x] drawing from JS into canvas
- [x] loading wasm file into our JS app
  - [x] create a simple WAT file (add.wat), compile it into add.wasm
  - [x] call funtion from the WASM file using exports and imports
  - [x] try the same using a ZIG file and build it into WASM
- [ ] play with the memory of the WASM file to draw something into the canvas...

- To run this: `zig build -Doptimize=ReleaseSmall && python3 -m http.server`

