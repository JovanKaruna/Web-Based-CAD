const initShaders = (gl, vertexId, fragmentId) => {
  var vertElement = document.getElementById(vertexId).innerHTML;
  var fragElement = document.getElementById(fragmentId).innerHTML;

  //make vertex and fragment shader
  var vertShader = compileCreateShader(gl, vertElement, gl.VERTEX_SHADER);
  var fragShader = compileCreateShader(gl, fragElement, gl.FRAGMENT_SHADER);

  //make program
  var program = gl.createProgram();

  //attach and link
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("Shader program failed to link. " + gl.getProgramInfoLog(program));
    return -1;
  }

  return program;
};

const compileCreateShader = (gl, id, shaderType) => {
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, id);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Failed to compile " + gl.getShaderInfoLog(shader));
    return;
  }
  return shader;
};

export default initShaders;
