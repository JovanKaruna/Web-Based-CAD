import initShaders from "./shader/initShaders.mjs";
import { flatten, euclidean } from "./utils/utils.mjs";
import save from "./functions/save.mjs";
import load from "./functions/load.mjs";

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

//SQUARE
var squares = [];
var squaresColor = [];
var squareEdit = [];
var tempSquareStart = [];
var tempSquareEnd = [];

var polygons = [];
var polygonsColor = [];
var polygonEdit = [];
var tempPolygonStart = [];
var tempPolygonEnd = [];

var bufferId;
var cbufferId;
var currentPolygonId = 0;

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

  squares = [];
  squaresColor = [];
  squareEdit = [];
  tempSquareStart = [];
  tempSquareEnd = [];

  polygons = [];
  polygonsColor = [];
  polygonEdit = [];
  tempPolygonStart = [];
  tempPolygonEnd = [];
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
  canvas.addEventListener("dblclick", (e) => {
    console.log("Double Click");
    
    var offsetX = -1 + (2 * e.offsetX) / canvas.width;
    var offsetY = -1 + (2 * (canvas.height - e.offsetY)) / canvas.height;
    var radio = document.getElementsByTagName("input");
    var edit = document.getElementById("edit").checked;

    for (var i = 0; i < radio.length; i++) {
      if (radio[i].type == "radio" && radio[i].checked) {
        if (radio[i].value == "polygon") {
            polygons[currentPolygonId].push(offsetX);
            polygons[currentPolygonId].push(offsetY);
            currentPolygonId++;
          }
        }
      }
    });

  canvas.addEventListener("mousemove", (e) => {
    if (mouseClicked == true) {
      console.log("Moved");
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
                  console.log(`lineEdit: ${lineEdit}`)
                  lines[lineEdit[4]] = createLine(
                    [offsetX, offsetY],
                    [lineEdit[2], lineEdit[3]]
                  );
                  console.log(`lines: ${lines}`)
                } else if (lineEdit[5] == 2) {
                  //x2 and y2 change
                  console.log(`lineEdit: ${lineEdit}`)
                  lines[lineEdit[4]] = createLine(
                    [lineEdit[0], lineEdit[1]],
                    [offsetX, offsetY]
                  );
                  console.log(`lines: ${lines}`)
                }
              }
            } else {
              //make model
              console.log(`lineEdit: ${lineEdit}`)
              tempLineEnd = [offsetX, offsetY];
              console.log(`tempLineEnd: ${tempLineStart}`)
              console.log(`tempLineStart: ${tempLineEnd}`)
              
            }
          } else if (radio[i].value == "square") {
            if (edit) {
              if (squareEdit.length > 0) {
                squares[squareEdit[1]] = createSquare(squareEdit[0], [
                  offsetX,
                  offsetY,
                ]);
              }
            } else {
              tempSquareEnd = [offsetX, offsetY];
            }
          } 
          else if (radio[i].value == "polygon") {
            // mouseClicked = false;
            tempPolygonEnd = [offsetX, offsetY];
            console.log("IKEH");
          }
          //   if (polygonEdit.length > 0) {
          //     if (polygonEdit[5] == 1) {
          //       //x1 and y1 changed
          //       console.log(`polygonEdit: ${lineEdit}`)
          //       polygons[polygonEdit[4]] = createLine(
          //         [offsetX, offsetY],
          //         [polygonEdit[2], polygonEdit[3]]
          //       );
          //     } else if (polygonEdit[5] == 2) {
          //       //x2 and y2 change
          //       console.log(`polygonEdit: ${lineEdit}`)
          //       polygons[polygonEdit[4]] = createLine(
          //         [polygonEdit[0], polygonEdit[1]],
          //         [offsetX, offsetY]
          //       );
          //     }
          //   }
          // } else {
          //   //make model
          //   console.log(`polygonEdit: ${polygonEdit}`)
          //   tempPolygonEnd = [offsetX, offsetY];
          //   console.log(`tempPolygonEnd: ${tempPolygonStart}`)
          //   console.log(`tempPolygonStart: ${tempPolygonEnd}`)
            
          // }
        }
      }
      render();
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    mouseClicked = true;
    console.log("Mouse Down");
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
            getPointSquares(offsetX, offsetY);
          } else {
            tempSquareStart = [offsetX, offsetY];
            tempSquareEnd = [offsetX, offsetY];
          }
        } else if (radio[i].value == "polygon") {
          if (edit) {
            // getPointPolygon(offsetX, offsetY);
            console.log("polygon")
          } else {
            tempPolygonStart = [offsetX, offsetY];
            tempPolygonEnd = [offsetX, offsetY];
            console.log("masuk sini")
            console.log(`Start: ${tempPolygonStart}`)
            console.log(`End: ${tempPolygonEnd}`)
          }
        }
      }
    }
    render();
  });

  canvas.addEventListener("mouseup", (e) => {
    console.log("Mouse Up")
    mouseClicked = false;
    var offsetX = -1 + (2 * e.offsetX) / canvas.width;
    var offsetY = -1 + (2 * (canvas.height - e.offsetY)) / canvas.height;
    var radio = document.getElementsByTagName("input");
    var edit = document.getElementById("edit").checked;
    console.log(radio)

    for (var i = 0; i < radio.length; i++) {
      if (radio[i].type == "radio" && radio[i].checked) {
        if (radio[i].value == "line") {
          if (edit) {
            // editting model
            lineEdit = [];
          } else {
            //make model
            lines.push(createLine(tempLineStart, tempLineEnd));
            console.log(lines)
            for (var i = 0; i < 2; ++i) {
              linesColor.push([color[0], color[1], color[2]]);
            }
            tempLineStart = [];
            tempLineEnd = [];
          }
        } else if (radio[i].value == "square") {
          if (edit) {
            squareEdit = [];
          } else {
            squares.push(createSquare(tempSquareStart, tempSquareEnd));
            for (var i = 0; i < 4; ++i) {
              squaresColor.push([color[0], color[1], color[2]]);
            }
            tempSquareStart = [];
            tempSquareEnd = [];
          }
        } else if (radio[i].value == "polygon") {
            if (edit) {
              // editting model
              polygonEdit = [];
            } else {
              //make model
              //first point of polygon
              // console.log("Polygon 1")
              if (polygons.length == 0 || (polygons.length == currentPolygonId)){
                // console.log(polygons)
                // console.log("Polygon 2")
                // console.log(createPolygon(tempPolygonStart, tempPolygonEnd));
                polygons.push(createPolygon(tempPolygonStart, tempPolygonEnd));
                // console.log(polygons)
              }
              else if (polygons.length != 0){
                console.log("Polygon 3")
                // console.log(polygons)
                polygons[currentPolygonId].push(tempPolygonEnd[0]);
                polygons[currentPolygonId].push(tempPolygonEnd[1]);
              }
              // for (var i = 0; i <  polygonSumVertices[]; ++i) {
              //   polygonsColor.push([color[0], color[1], color[2]]);
              // }
              tempPolygonStart = [];
              tempPolygonEnd = [];
            }
          } else {
            console.log("No Input");
          }
    render();
        }
      }
  });
  

  changeColor();

  document.getElementById("clear").addEventListener("click", () => {
    clearAll();
    render();
  });

  document.getElementById("save").addEventListener("click", () => {
    save(lines, linesColor, squares, squaresColor);
  });

  document.getElementById("load").addEventListener("change", () => {
    const selectedFile = document.getElementById("load").files[0];
    document.getElementById("load").value = ''; //reset file in load
    if (selectedFile) {
      var reader = new FileReader();
      reader.onload = function () {
        var fileContent = JSON.parse(reader.result);
        var loadedData = load(fileContent);
        clearAll();

        //Line
        lines = loadedData[0];
        linesColor = loadedData[1];

        //Square
        squares = loadedData[2];
        squaresColor = loadedData[3];
        render();
      };
      reader.readAsText(selectedFile);
    }
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
  // console.log(linesColorRender.length)
  for (var i = 0; i < linesRender.length / 4; i++) {
    gl.drawArrays(gl.LINES, 2 * i, 2);
  }
};

/*** SQUARES ***/
const getPointSquares = (x, y) => {
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      if (euclidean(x, y, squares[i][j][0], squares[i][j][1]) < 0.02) {
        if (j > 1) {
          squareEdit = [squares[i][j - 2], i];
        } else {
          squareEdit = [squares[i][j + 2], i];
        }
      }
    }
  }
};

const createSquare = (start, end) => {
  var x1 = start[0];
  var y1 = start[1];
  var x2 = end[0];
  var y2 = end[1];

  var length = x1 - x2;
  var width = y1 - y2;
  var delta = Math.min(Math.abs(length), Math.abs(width));
  var delta_x = delta;
  var delta_y = delta;

  if (length > 0) {
    delta_x *= -1;
  }

  if (width > 0) {
    delta_y *= -1;
  }

  return [
    [x1, y1],
    [x1 + delta_x, y1],
    [x1 + delta_x, y1 + delta_y],
    [x1, y1 + delta_y],
  ];
};

const renderSquare = () => {
  var squaresRender = [];
  var squaresColorRender = [];

  squares.forEach((square) => {
    square.forEach((point) => squaresRender.push(point));
  });

  squaresColor.forEach((colors) => {
    colors.forEach((dec) => {
      squaresColorRender.push(dec);
    });
  });

  if (tempSquareEnd.length != 0) {
    createSquare(tempSquareStart, tempSquareEnd).forEach((point) =>
      squaresRender.push(point)
    );
    for (var i = 0; i < 4; ++i) {
      squaresColorRender.push(color[0], color[1], color[2]);
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(squaresRender));
  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(squaresColorRender));
  
  for (var i = 0; i < squaresRender.length / 4; i++) {
    gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
};

/*** POLYGON ***/
// const getPointPolygon = (x, y) => {
//   for (let i = 0; i < polygons.length; i++) {
//     for (let j = 0; j < polygons[i].length; j++) {
//       if (euclidean(x, y, polygons[i][j], polygons[i][j + 1]) < 0.02) {
//         var x1 = polygons[i][0];
//         var y1 = polygons[i][1];
//         var x2 = polygons[i][2];
//         var y2 = polygons[i][3];

//         // if (j < 2) {
//         //   polygonEdit = [x1, y1, x2, y2, i, 1];
//         // } else {
//         //   polygonEdit = [x1, y1, x2, y2, i, 2];
//         // }
//       }
//     }
//   }
// };

const createPolygon = (start, end) => {
  return [start[0], start[1], end[0], end[1]];
};

const renderPolygon = () => {
  var polygonsRender = [];
  var polygonsColorRender = [];
  var polygonSumVertices = [];
  var tempi = 0;
  var tempj = 0;
  var polygonsColor = [];

  polygons.forEach((polygon) => 
  {
    polygon.forEach((point) => polygonsRender.push(point));
    polygonSumVertices.push(polygon.length);
  });


  polygonSumVertices.forEach((sum) => 
  {
    for (var i = 0; i < sum; ++i) {
        polygonsColor.push([color[0], color[1], color[2]]);
    }
  });

  polygonsColor.forEach((colors) => {
    colors.forEach((dec) => {
      polygonsColorRender.push(dec);
    });
  });


  // if (tempPolygonEnd.length != 0) {
  //   createPolygon(tempPolygonStart, tempPolygonEnd).forEach((point) =>
  //     polygonsRender.push(point)
  //   );
  //   for (var i = 0; i < 4; ++i) {
  //     polygonsColorRender.push(color[0], color[1], color[2]);
  //   }
  // }
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(polygonsRender));
  gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(polygonsColorRender));

  // console.log("aneh lo")
  // console.log(polygonsRender.length)
  // console.log(polygonSumVertices)
  while (tempi < polygonsRender.length) {
    gl.drawArrays(gl.TRIANGLE_FAN, tempi, polygonSumVertices[tempj]);
    tempi+=polygonSumVertices[tempj];
    tempj++;
  }
  // console.log("aneh lo 2")
};

//Render all models
const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  renderLine();
  renderSquare();
  renderPolygon();
};

window.onload = init;
