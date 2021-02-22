import initShaders from "./shader/initShaders.mjs";
import { flatten } from "./utils/functions.mjs";
import { vec2 } from "./utils/utils.mjs";

var canvas;
var gl;

var currPts = [];
var points = [];
var colors = [];

var mouseClicked = false;
var lineColor = [0, 0, 0];
var temp_start;
var temp_end;

var bufferId;
var cbufferId;

const maxPoints = 200000;

const init = () => {
  canvas = document.getElementById("main-canvas");

  gl = canvas.getContext("webgl");
  if (!gl) {
    alert("WebGL isn't available");
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Vertex buffer
  bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxPoints, gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Color buffer
  cbufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxPoints, gl.STATIC_DRAW);
  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  eventListener();
};

//Function to clear canvas
const clearCanvas = () => {
  document.getElementById("clear").addEventListener("click", () => {
    points = [];
    currPts = [];
    colors = [];
    render();
  });
};

//Function to change color
const changeColor = () => {
  var color = document.getElementById("color");
  color.addEventListener("change", () => {
    const colorValue = color.value;
    lineColor = [
      parseInt(colorValue.slice(1, 3), 16) / 255,
      parseInt(colorValue.slice(3, 5), 16) / 255,
      parseInt(colorValue.slice(5, 7)) / 255,
    ];
  });
};

//All Event listener
const eventListener = () => {
  canvas.addEventListener("mousemove", (e) => {
    if (mouseClicked == true) {
      var offsetX = -1 + (2 * e.offsetX) / canvas.width;
      var offsetY = -1 + (2 * (canvas.height - e.offsetY)) / canvas.height;
      var radio = document.getElementsByTagName("input");
      var edit = document.getElementById("edit").checked;

      for (var i = 0; i < radio.length; i++) {
        if (radio[i].type == "radio" && radio[i].checked) {
          if (radio[i].value == "line") {
            temp_end = [offsetX, offsetY];
          } else if (radio[i].value == "square") {
            console.log("square");
          } else if (radio[i].value == "polygon") {
            console.log("square");
          }
        }
      }
      render();
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    mouseClicked = true;
    var offsetX = -1 + (2 * e.offsetX) / canvas.width;
    var offsetY = -1 + (2 * (canvas.height - e.offsetY)) / canvas.height;
    var radio = document.getElementsByTagName("input");
    var edit = document.getElementById("edit").checked;

    for (var i = 0; i < radio.length; i++) {
      if (radio[i].type == "radio" && radio[i].checked) {
        if (radio[i].value == "line") {
          temp_start = [offsetX, offsetY];
          temp_end = [offsetX, offsetY];
        } else if (radio[i].value == "square") {
          console.log("square");
        } else if (radio[i].value == "polygon") {
          console.log("square");
        }
      }
    }
    render();
  });

  canvas.addEventListener("mouseup", (e) => {
    mouseClicked = false;
    var offsetX = -1 + (2 * e.offsetX) / canvas.width;
    var offsetY = -1 + (2 * (canvas.height - e.offsetY)) / canvas.height;
    var radio = document.getElementsByTagName("input");
    var edit = document.getElementById("edit").checked;

    for (var i = 0; i < radio.length; i++) {
      if (radio[i].type == "radio" && radio[i].checked) {
        if (radio[i].value == "line") {
          currPts.push(temp_start, temp_end);
          temp_start = [];
          temp_end = [];
        } else if (radio[i].value == "square") {
          console.log("square");
        } else if (radio[i].value == "polygon") {
          console.log("square");
        }
      }
    }
    render();

    currPts = [];
  });

  changeColor();

  clearCanvas();

  render();
};

const createLine = (begin, end) => {
  var width = 0.005;
  var beta = Math.PI / 2.0 - Math.atan2(end[1] - begin[1], end[0] - begin[0]);
  var delta_x = Math.cos(beta) * width;
  var delta_y = Math.sin(beta) * width;
  return [
    vec2(begin[0] - delta_x, begin[1] + delta_y),
    vec2(begin[0] + delta_x, begin[1] - delta_y),
    vec2(end[0] + delta_x, end[1] - delta_y),
    vec2(end[0] - delta_x, end[1] + delta_y),
  ];
};

const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (currPts.length == 2) {
    var tempPts = createLine(currPts[0], currPts[1]);
    points.push(tempPts[0], tempPts[1], tempPts[2], tempPts[3]);
    for (var i = 0; i < 4; ++i) {
      colors.push(lineColor[0], lineColor[1], lineColor[2]);
    }
    currPts.shift();
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colors));
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
  for (var i = 0; i < points.length / 4; i++) {
    gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  console.log(points);
};

window.onload = init;
