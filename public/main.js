import initShaders from "./shader/initShaders.mjs";
import { flatten, euclidean } from "./utils/functions.mjs";
import { vec2 } from "./utils/utils.mjs";

var canvas;
var gl;

var mouseClicked = false;
var color = [0, 0, 0];

//LINE
var lines = [];
var linesColor = [];
var lineEdit = [];
var tempLineStart = [];
var tempLineEnd = [];

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

//Function for clear canvas
const clearAll = () => {
  lines = [];
  linesColor = [];
  lineEdit = [];
  tempLineStart = [];
  tempLineEnd = [];
};

//Function to change color
const changeColor = () => {
  var inputColor = document.getElementById("color");
  inputColor.addEventListener("change", () => {
    const colorValue = inputColor.value;
    color = [
      parseInt(colorValue.slice(1, 3), 16) / 255,
      parseInt(colorValue.slice(3, 5), 16) / 255,
      parseInt(colorValue.slice(5, 7), 16) / 255,
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
            if (edit) {
              // editting model
              if (lineEdit.length > 0) {
                if (lineEdit[5] == 1) {
                  //x1 and y1 changed
                  lines[lineEdit[4]] = createLine(
                    [offsetX, offsetY],
                    [lineEdit[2], lineEdit[3]]
                  );
                } else if (lineEdit[5] == 2) {
                  //x2 and y2 change
                  lines[lineEdit[4]] = createLine(
                    [lineEdit[0], lineEdit[1]],
                    [offsetX, offsetY]
                  );
                }
              }
            } else {
              //make model
              tempLineEnd = [offsetX, offsetY];
            }
          } else if (radio[i].value == "square") {
            if (edit) {
              console.log("edit");
            } else {
              console.log("square");
            }
          } else if (radio[i].value == "polygon") {
            if (edit) {
              console.log("edit");
            } else {
              console.log("polygon");
            }
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
          if (edit) {
            // editting model
            getPointLines(offsetX, offsetY);
          } else {
            //make model
            tempLineStart = [offsetX, offsetY];
            tempLineEnd = [offsetX, offsetY];
          }
        } else if (radio[i].value == "square") {
          if (edit) {
            console.log("edit");
          } else {
            console.log("square");
          }
        } else if (radio[i].value == "polygon") {
          if (edit) {
            console.log("edit");
          } else {
            console.log("polygon");
          }
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
          if (edit) {
            // editting model
            lineEdit = [];
          } else {
            //make model
            lines.push(createLine(tempLineStart, tempLineEnd));
            for (var i = 0; i < 2; ++i) {
              linesColor.push([color[0], color[1], color[2]]);
            }
            tempLineStart = [];
            tempLineEnd = [];
          }
        } else if (radio[i].value == "square") {
          if (edit) {
            console.log("edit");
          } else {
            console.log("square");
          }
        } else if (radio[i].value == "polygon") {
          if (edit) {
            console.log("edit");
          } else {
            console.log("polygon");
          }
        }
      }
    }
    render();
  });

  changeColor();

  document.getElementById("clear").addEventListener("click", () => {
    clearAll();
    render();
  });

  render();
};

/*** LINE MODEL ***/
const getPointLines = (x, y) => {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j += 2) {
      if (euclidean(x, y, lines[i][j], lines[i][j + 1]) < 0.02) {
        var x1 = lines[i][0];
        var y1 = lines[i][1];
        var x2 = lines[i][2];
        var y2 = lines[i][3];

        if (j < 2) {
          lineEdit = [x1, y1, x2, y2, i, 1];
        } else {
          lineEdit = [x1, y1, x2, y2, i, 2];
        }
      }
    }
  }
};

const createLine = (start, end) => {
  return [start[0], start[1], end[0], end[1]];
};

const renderLine = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);

  var linesRender = [];
  var linesColorRender = [];

  lines.forEach((line) => {
    line.forEach((point) => linesRender.push(point));
  });

  linesColor.forEach((colors) => {
    colors.forEach((dec) => {
      linesColorRender.push(dec);
    });
  });

  if (tempLineEnd.length != 0) {
    createLine(tempLineStart, tempLineEnd).forEach((point) =>
      linesRender.push(point)
    );
    for (var i = 0; i < 2; ++i) {
      linesColorRender.push(color[0], color[1], color[2]);
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(linesRender));
  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(linesColorRender));
  for (var i = 0; i < linesRender.length / 4; i++) {
    gl.drawArrays(gl.LINES, 2 * i, 2);
  }
};

//Render all models
const render = () => {
  renderLine();
};

window.onload = init;
