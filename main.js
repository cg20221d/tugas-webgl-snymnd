const main = () =>{
    const canvas = document.querySelector('#kanvas');
    const gl = canvas.getContext('webgl');
    
    const buffer = gl.createBuffer();

    // vertex shader
    const vertexShaderCode = 
    `
    attribute vec2 aPosition;
    void main() {
        float x = aPosition.x;
        float y = aPosition.y;
        gl_PointSize = 50.0;
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
    
    gl.clearColor(0.0, 1.0, 1.0, 1.0); //(R G B A)
    gl.clear(gl.COLOR_BUFFER_BIT);
    // bind attribute : told gpu how to collect position value from buffer to  every vertex that processing 
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    
    
    // drawing function
    const drawing = (vertices, start=0, end) =>{        
        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);
        gl.drawArrays(gl.LINE_LOOP, start, end);
    }
    

    //f form 7
    const vertices7 = [
        //vertices form number 7
        -0.9, 0.9, 
        -0.55, 0.9,

        -0.8, 0.5,
        -0.9, 0.5,

        -0.7, 0.82,
        -0.9, 0.82,
    ];
    drawing(vertices7, 0, 6); 

    // form 1
    const vertices1 = [
        //vertices form number 7
        -0.4, 0.9, 
        -0.3, 0.9,
        
        -0.3, 0.58,
        -0.25, 0.58,
        
        -0.25, 0.5,
        -0.45, 0.5,

        -0.45, 0.58,
        -0.4, 0.58,

        -0.4, 0.8,
        -0.45, 0.8,

        -0.45, 0.85,
    ];
    drawing(vertices1, 0, 11); 
}