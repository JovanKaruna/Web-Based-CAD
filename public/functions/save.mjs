export const save = (lines, linesColor, squares, squaresColor, polygons, polygonsColor) => {
  var data = {
    lines: getAllLinesJSON(lines, linesColor),
    squares: getAllSquaresJSON(squares, squaresColor),
    polygons: getAllPolygonsJSON(polygons, polygonsColor),
  };

  var jsonData = JSON.stringify(data);

  download(jsonData, "canvasData.json", "json");
};

const getAllLinesJSON = (lines, linesColor) => {
  var lineArray = [];
  for (var i = 0; i < lines.length; i++) {
    var lineJSON = {
      x1: lines[i][0],
      y1: lines[i][1],
      x2: lines[i][2],
      y2: lines[i][3],
      color_R: linesColor[i * 2][0],
      color_G: linesColor[i * 2][1],
      color_B: linesColor[i * 2][2],
    };
    lineArray.push(lineJSON);
  }
  return lineArray;
};

const getAllSquaresJSON = (squares, squaresColor) => {
  var squareArray = [];
  for (var i = 0; i < squares.length; i++) {
    var squareJSON = {
      point1: {
        x: squares[i][0][0],
        y: squares[i][0][1],
      },
      point2: {
        x: squares[i][1][0],
        y: squares[i][1][1],
      },
      point3: {
        x: squares[i][2][0],
        y: squares[i][2][1],
      },
      point4: {
        x: squares[i][3][0],
        y: squares[i][3][1],
      },
      color_R: squaresColor[i * 4][0],
      color_G: squaresColor[i * 4][1],
      color_B: squaresColor[i * 4][2],
    };
    squareArray.push(squareJSON);
  }
  return squareArray;
};

//Per titik masih belum implemented
const getAllPolygonsJSON = (polygons, polygonsColor) => {
  var polygonArray = [];
  for (var i = 0; i < polygons.length; i++) {
    var polygonJSON = {
      point1: {
        x: polygons[i][0][0],
        y: polygons[i][0][1],
      },
      point2: {
        x: squares[i][1][0],
        y: squares[i][1][1],
      },
      point3: {
        x: squares[i][2][0],
        y: squares[i][2][1],
      },
      point4: {
        x: squares[i][3][0],
        y: squares[i][3][1],
      },
      color_R: polygonsColor[i * 4][0],
      color_G: polygonsColor[i * 4][1],
      color_B: polygonsColor[i * 4][2],
    };
    polygonArray.push(polygonJSON);
  }
  return polygonArray;
}

const download = (content, fileName, contentType) => {
  var el = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  el.href = URL.createObjectURL(file);
  el.download = fileName;
  el.click();
};

export default save;
