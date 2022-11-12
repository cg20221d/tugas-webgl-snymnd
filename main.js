const main = () =>{
    const canvas = document.querySelector('#kanvas');
    const gl = canvas.getContext('webgl');
    
    const buffer = gl.createBuffer();

    // vertex shader
    const vertexShaderCode = 
    `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    varying vec3 vColor;
    uniform mat4 uModel;
    void main() {
        vec2 position = aPosition;
        gl_PointSize = 50.0;
        gl_Position = uModel * vec4(position, 0.0, 1.0);
    }`
    const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); //sampai sini sudah menjadi .o

    // fragmen shader
    const fragmenShaderCode = `
    precision mediump float;
    varying vec3 vColor;
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

        // varoaible lokal
    var theta = 0.0;
    var freeze = false;
    var horizontalSpeed = 0.0;
    var verticalSpeed = 0.0;
    var horizontalDelta = 0.0;
    var verticalDelta = 0.0;
    
        
    gl.clearColor(0.0, 1.0, 1.0, 1.0); //(R G B A)
    gl.clear(gl.COLOR_BUFFER_BIT);


    // variable pointer ke GLSL
    var uModel = gl.getUniformLocation(shaderProgram, "uModel");
    // bind attribute : told gpu how to collect position value from buffer to  every vertex that processing 
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    const aColor = gl.getAttribLocation(shaderProgram, 'aColor');
        
    
    // drawing function
    const drawing = (vertices, start=0, end, glType=gl.LINE_LOOP) =>{        
        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 
            0 * Float32Array.BYTES_PER_ELEMENT, 
            0 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(aPosition);
        gl.drawArrays(glType, start, end);
        // gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 
        //     0 * Float32Array.BYTES_PER_ELEMENT, 
        //     0 * Float32Array.BYTES_PER_ELEMENT 
        // );
        // gl.enableVertexAttribArray(aColor);
    }
    const render = () => {    
        gl.clearColor(0.0, 1.0, 1.0, 1.0); //(R G B A)
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (!freeze) {
            theta += 0.1;
        }
        horizontalDelta += horizontalSpeed;
        verticalDelta -= verticalSpeed;
        var model = glMatrix.mat4.create();
        glMatrix.mat4.rotateY(
            model,
            model,
            theta * Math.PI / 10
        ) 
        glMatrix.mat4.translate(model, model, [horizontalDelta, verticalDelta, 0.0]);
        gl.uniformMatrix4fv(uModel,false, model);
        objects.map((object) => {
            drawing(object.vertices, 0, object.length, object.type);
        });
        // gl.drawArrays(gltype, start, end);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    
    //f form 7
    const vertices7 = [
        //vertices form number 7
        -0.8, 0.9, 
        -0.5, 0.9,
        -0.5, 0.82, 
        -0.7, 0.5,
        -0.8, 0.5,
        
        -0.6, 0.82,
        -0.8, 0.82,
    ];
    // drawing(vertices7, 0, 7); 
    
    // form 1
    const vertices1 = [
        //vertices form number 1
        -0.3, 0.9, 
        -0.2, 0.9,
        
        -0.2, 0.58,
        -0.15, 0.58,
        
        -0.15, 0.5,
        -0.35, 0.5,
        
        -0.35, 0.58,
        -0.3, 0.58,
        
        -0.3, 0.8,
        -0.35, 0.8,
        
        -0.35, 0.85,
    ];
    // drawing(vertices1, 0, 11); 
    
    
    // form u
    const verticesU = [
        //vertices form number U
        -0.9, 0.4, //a
        -0.8, 0.3, //b
        -0.9, 0.0, //c
        
        -0.8, 0.0, //bcd
        -0.8, -0.1, //cde
        -0.6, 0.0, //def
        
        -0.6, -0.1, //efg
        -0.5, 0.0, //fgh
        -0.6, 0.3, //ghi
        -0.5, 0.4, //hij
    ];
    // drawing(verticesU, 0, 10, gl.TRIANGLE_STRIP); 
    
    // form S
    const verticesS = [
        //vertices form number S
        -0.1, 0.4, //a
        -0.0, 0.3, //b
        -0.3, 0.4, //c
        
        -0.3, 0.3, //bcd
        -0.4, 0.3, //cde
        -0.3, 0.2, //eff
        
        -0.4, 0.2, //deg
        -0.3, 0.1, //fgh
        -0.1, 0.2, //ghi
        
        -0.1, 0.1, //hij
        -0.0, 0.1, //ijk
        -0.1, 0.0, //jkl
        
        -0.0, 0.0, //klm
        -0.1, -0.1, //lmn
        -0.4, 0.0, //mno
        
        -0.3, -0.1, //mno
    ];
    // drawing(verticesS, 0, 16, gl.TRIANGLE_STRIP); 

    const objects = [
        {
            vertices: vertices7,
            length: 7,
            type: gl.LINE_LOOP,
        },
        {
            vertices: vertices1,
            length: 11,
            type: gl.LINE_LOOP,
        },
        {
            vertices: verticesU,
            length: 10,
            type: gl.TRIANGLE_STRIP,
        },
        {
            vertices: verticesS,
            length: 16,
            type: gl.TRIANGLE_STRIP,
        },
    ]
    console.log(objects);


}