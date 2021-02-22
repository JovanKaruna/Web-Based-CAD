export function vec2() {
  function _argumentsToArray(args) {
    return [].concat.apply([], Array.prototype.slice.apply(args));
  }
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
  }

  return result.splice(0, 2);
}
