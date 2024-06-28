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


async function load_wasm() {
  // https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate_static
  const importObject = {
    imports: {
      ilog(arg) { // ilog stands for (i)mported (log)
        console.log(arg);
      },
    },
  };

  const response = await fetch('add.wasm');
  const bytes = await response.arrayBuffer();
  const buffer = await WebAssembly.instantiate(bytes, importObject);
  const exports = buffer.instance.exports;

  console.log(exports);

  const answer_to_life = exports.add(30, 12);
  document.getElementById('answer').textContent = `The answer to life, the universe, and everything is ${answer_to_life}`;
}

// Call the function when the window loads
window.onload = () => {
    load_wasm();
    drawCircleInBox('canvas_1');
    drawCircleInBox('canvas_2');
};