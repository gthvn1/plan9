// app.js

// Function to draw a circle in a box on the canvas
function drawCircleInBox(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
        console.error('2D context not found');
        return;
    }

    // Set canvas size
    const width = canvas.width;
    const height = canvas.height;

    // Draw the box
    context.fillStyle = '#D8DEE9';
    context.fillRect(0, 0, width, height);

    // Draw the circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fillStyle = '#EBCB8B';
    context.fill();
    context.stroke();
}

// Importing from add.wasm
async function loadWasmWat() {
  // https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate_static
  const importObject = {
    env: {
      ilog(arg) { // ilog stands for (i)mported (log)
        console.log(arg);
      },
    },
  };

  const buffer = await WebAssembly.instantiateStreaming(fetch('add.wasm'), importObject);
  const exports = buffer.instance.exports;

  console.log(exports);

  const answer_to_life = exports.add(30, 12);
  document.getElementById('answer_from_wat').textContent = `WAT: The answer to life, the universe, and everything is ${answer_to_life}`;
}

async function callFuncFromZigWasm() {
  // https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate_static
  const importObject = {
    env: {
      ilog(arg) { // ilog stands for (i)mported (log)
        console.log(arg);
      },
    },
  };

  const buffer = await WebAssembly.instantiateStreaming(fetch('./zig-out/bin/math.wasm'), importObject);
  const exports = buffer.instance.exports;

  console.log(exports);

  // We need to create a view on memory to get the output of speak
  const memory = exports.memory;

  // Run "speak", only first parameter is used. And it is the index in memory
  const output_length = exports.speak(0, 1, 1);
  console.log("speak returns: " + output_length);

  const output_view = new Uint8Array(memory.buffer, 0, output_length);
  const output = new TextDecoder().decode(output_view);
  document.getElementById('answer_from_zig').textContent = "ZIG: " + output;

  // Now we can draw something in canvas_2
  const canvas = document.getElementById("canvas_2");
  const context = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  function updateCanvas() {
    // Now call draw,
    // The lenght is the size of the canvas
    // A pixel is in ABGR format so we need 4 bytes, so capacity is size * 4
    const res = exports.draw(0, w * h, w * h * 4);
    console.log("draw returns: " + res);

    // We need to create a view and put it in image data.
    const canvas_view = new Uint8Array(memory.buffer, 0, w * h * 4);
    const image_data = context.createImageData(w, h);
    image_data.data.set(canvas_view);
    context.putImageData(image_data, 0, 0);
    // Disable animation for now, it is easy to debug
    //window.requestAnimationFrame(updateCanvas);
  }

  updateCanvas();
}

async function callFuncJson() {
  // https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate_static
  const importObject = {};

  const buffer = await WebAssembly.instantiateStreaming(fetch('./zig-out/bin/json.wasm'), importObject);
  const exports = buffer.instance.exports;
  const memory = exports.memory;

  function reverseNamesNice(data) {
    const input = JSON.stringify(data);

    const memoryView = new Uint8Array(memory.buffer);
    const { written } = new TextEncoder().encodeInto(input, memoryView);

    const outputLength = exports.reverseNames(0, written, memoryView.byteLength);

    const outputView = new Uint8Array(memory.buffer, 0, outputLength);
    const output = new TextDecoder().decode(outputView);
    return JSON.parse(output);
  }

  console.log(
    reverseNamesNice([
      { name: 'John', id: 1 },
      { name: 'Doe', id: 2 },
    ])
  );
}

// Call the function when the window loads
window.onload = () => {
  loadWasmWat();
  drawCircleInBox('canvas_1');
  callFuncFromZigWasm();
  callFuncJson();
};
