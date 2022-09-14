const main = () =>{
    const canvas = document.querySelector('#kanvas');
    const gl = canvas.getContext('webgl');

    // vertex shader
    const vertexShaderCode = 
    `void main() {
        float x = 0.0;
        float y = 0.0;
        gl_PointSize = 100.0;
        gl_Position = vec4(x, y, 0.0, 1.0);
    }`
    const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); //sampai sini sudah menjadi .o

    // fragmen shader
    const fragmenShaderCode = `
    precision mediump float;
    void main(){

        float r = 1.0;
        float g = 0.0;
        float b = 1.0;
        gl_FragColor = vec4(r, g, b, 1.0);


    }`
    const fragmenShaaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmenShaaderObject, fragmenShaderCode);
    gl.compileShader(fragmenShaaderObject); //sampai sini sudah menjadi .o

    // shader program
    const shaderProgram = gl.createProgram(); //(.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmenShaaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // drawing
    gl.clearColor(0.0, 1.0, 1.0, 1.0); //(R G B A)
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}