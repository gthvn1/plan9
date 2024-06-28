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
    context.fillStyle = '#DDDDDD';
    context.fillRect(0, 0, width, height);

    // Draw the circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fillStyle = '#FF0000';
    context.fill();
    context.stroke();
}

// Importing from add.wasm
async function load_wasm_wat() {
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

async function load_wasm_zig() {
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

  // We need to create a view on memory to get the output of sayHello
  const memory = exports.memory;
  const mem_view = new Uint8Array(memory.buffer);

  const output_lenght = exports.sayHello(0, 1, mem_view.byteLength);
  console.log(output_lenght);

  const output_view = new Uint8Array(memory.buffer, 0, output_lenght);
  const output = new TextDecoder().decode(output_view);
  console.log(output);

  const answer_to_life = exports.add(30, 12);
  document.getElementById('answer_from_zig').textContent = `ZIG: The answer to life, the universe, and everything is ${answer_to_life}`;
}

// Call the function when the window loads
window.onload = () => {
  load_wasm_wat();
  load_wasm_zig();
  drawCircleInBox('canvas_1');
  drawCircleInBox('canvas_2');
};
