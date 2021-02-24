export const load = (data) => {
  var filteredLine = filterLines(data.lines);
  var filteredSquare = filterSquare(data.squares);
  var filteredPolygon = filterPolygon(data.polygons)

  return [
    filteredLine[0],
    filteredLine[1],
    filteredSquare[0],
    filteredSquare[1],
    filteredPolygon[0],
    filteredPolygon[1],
  ];
};

const filterLines = (dataLines) => {
  var lines = [];
  var linesColor = [];
  for (var i = 0; i < dataLines.length; i++) {
    var line = [
      dataLines[i].x1,
      dataLines[i].y1,
      dataLines[i].x2,
      dataLines[i].y2,
    ];
    var lineColor = [
      dataLines[i].color_R,
      dataLines[i].color_G,
      dataLines[i].color_B,
    ];
    lines.push(line);
    for (var j = 0; j < 2; j++) {
      linesColor.push(lineColor);
    }
  }
  return [lines, linesColor];
};

const filterSquare = (dataSquares) => {
  var squares = [];
  var squaresColor = [];
  for (var i = 0; i < dataSquares.length; i++) {
    var square = [
      [dataSquares[i].point1.x, dataSquares[i].point1.y],
      [dataSquares[i].point2.x, dataSquares[i].point2.y],
      [dataSquares[i].point3.x, dataSquares[i].point3.y],
      [dataSquares[i].point4.x, dataSquares[i].point4.y],
    ];
    var squareColor = [
      dataSquares[i].color_R,
      dataSquares[i].color_G,
      dataSquares[i].color_B,
    ];
    squares.push(square);
    for (var j = 0; j < 4; j++) {
      squaresColor.push(squareColor);
    }
  }
  return [squares, squaresColor];
};

//Implementasi titik polygon belum selesai
const filterPolygon = (dataPolygons) => {
  var polygons = [];
  var polygonsColor = [];
  for(var i = 0; i < dataPolygons.length; i++){
    // var polygon = 

  }
}

export default load;
