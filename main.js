const main = () =>{
    const canvas = document.querySelector('#kanvas');
    const gl = canvas.getContext('webgl');

    // vertex shader
    const vertexShaderCode = 
    `void main() {

    }`
    const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); //sampai sini sudah menjadi .o

    // fragmen shader
    const fragmenShaderCode = 
    `void main(){

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
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //(R G B A)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // animasi
    let a = 2;
    let loop = () =>{
        gl.clearColor(0.0, 1.0, 0.0, 1.0); //(R G B A)
        gl.clear(gl.COLOR_BUFFER_BIT);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);


}