export const flatten = (v) => {
  if (v.matrix === true) {
    v = transpose(v);
  }

  var n = v.length;
  var elemsAreArrays = false;

  if (Array.isArray(v[0])) {
    elemsAreArrays = true;
    n *= v[0].length;
  }

  var floats = new Float32Array(n);

  if (elemsAreArrays) {
    var idx = 0;
    for (var i = 0; i < v.length; ++i) {
      for (var j = 0; j < v[i].length; ++j) {
        floats[idx++] = v[i][j];
      }
    }
  } else {
    for (var i = 0; i < v.length; ++i) {
      floats[i] = v[i];
    }
  }

  return floats;
};

export const euclidean = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/** Convex HUll */
"use strict";
// var convexhull;
// (function (convexhull) {
//     // Returns a new array of points representing the convex hull of
//     // the given set of points. The convex hull excludes collinear points.
//     // This algorithm runs in O(n log n) time.
//     function makeHull(points) {
//         var newPoints = points.slice();
//         newPoints.sort(convexhull.POINT_COMPARATOR);
//         return convexhull.makeHullPresorted(newPoints);
//     }
//     convexhull.makeHull = makeHull;
//     // Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
//     function makeHullPresorted(points) {
//         if (points.length <= 1)
//             return points.slice();
//         // Andrew's monotone chain algorithm. Positive y coordinates correspond to "up"
//         // as per the mathematical convention, instead of "down" as per the computer
//         // graphics convention. This doesn't affect the correctness of the result.
//         var upperHull = [];
//         for (var i = 0; i < points.length; i++) {
//             var p = points[i];
//             while (upperHull.length >= 2) {
//                 var q = upperHull[upperHull.length - 1];
//                 var r = upperHull[upperHull.length - 2];
//                 if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
//                     upperHull.pop();
//                 else
//                     break;
//             }
//             upperHull.push(p);
//         }
//         upperHull.pop();
//         var lowerHull = [];
//         for (var i = points.length - 1; i >= 0; i--) {
//             var p = points[i];
//             while (lowerHull.length >= 2) {
//                 var q = lowerHull[lowerHull.length - 1];
//                 var r = lowerHull[lowerHull.length - 2];
//                 if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
//                     lowerHull.pop();
//                 else
//                     break;
//             }
//             lowerHull.push(p);
//         }
//         lowerHull.pop();
//         if (upperHull.length == 1 && lowerHull.length == 1 && upperHull[0].x == lowerHull[0].x && upperHull[0].y == lowerHull[0].y)
//             return upperHull;
//         else
//             return upperHull.concat(lowerHull);
//     }
//     convexhull.makeHullPresorted = makeHullPresorted;
//     function POINT_COMPARATOR(a, b) {
//         if (a.x < b.x)
//             return -1;
//         else if (a.x > b.x)
//             return +1;
//         else if (a.y < b.y)
//             return -1;
//         else if (a.y > b.y)
//             return +1;
//         else
//             return 0;
//     }
//     convexhull.POINT_COMPARATOR = POINT_COMPARATOR;
// })(convexhull || (convexhull = {}));

// export var convexhull