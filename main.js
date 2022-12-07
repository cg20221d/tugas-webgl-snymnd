const main = () =>{
    const canvas = document.querySelector('#kanvas');
    const gl = canvas.getContext('webgl');
    
    // vertex shader
    const vertexShaderCode = 
    `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    varying vec3 vColor;
    void main() {

        // gl_PointSize = 50.0;
        gl_Position =  uProjection * uView *   uModel * vec4(aPosition, 1.0);
        vColor = aColor;
    }`
    const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); //sampai sini sudah menjadi .o

    // fragmen shader
    const fragmenShaderCode = `
    precision mediump float;
    varying vec3 vColor;

    void main(){
        gl_FragColor = vec4(vColor, 1.0);
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
    var yDelta = 0.0;
    var xDelta = 0.0;
    var zCubeDelta = 0.0;
    var xCubeDelta = 0.0;

    var scaler = 4.0; //scalasi 4x

    // View
    var cameraX = 0.0;
    var cameraZ = 7.5;
    var view = glMatrix.mat4.create();
    // var uView = gl.getUniformLocation(shaderProgram, "uView");
    glMatrix.mat4.lookAt(
        view,
        [cameraX, 0, cameraZ],    // the location of the eye or the camera
        [cameraX, 0.0, 0],        // the point where the camera look at
        [0.0, 1.0, 0.0]
    );
    var perspective = glMatrix.mat4.create();
    glMatrix.mat4.perspective(perspective, Math.PI/2.4, 1.0, 0.5, 50.0);
    
    // drawing function
    const drawing = (vertices, indices, glType=gl.LINE_LOOP) =>{ 
        const buffer = gl.createBuffer();
        const indexBuffer = gl.createBuffer();

        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        
        const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
        const aColor = gl.getAttribLocation(shaderProgram, 'aColor');
        // variable pointer ke GLSL
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 
            6 * Float32Array.BYTES_PER_ELEMENT, 
            0 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(aPosition);

        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 
            6 * Float32Array.BYTES_PER_ELEMENT, 
            3 * Float32Array.BYTES_PER_ELEMENT 
        );
        gl.enableVertexAttribArray(aColor);
        
        gl.drawElements(glType,indices.length, gl.UNSIGNED_SHORT, 0);
    }
    
    const frameWidth = 12.4 //in mat4 unit
    var horizontalSpeed = 0.171; //nrp
    var horizontalDelta = 0.0;
    var scaleDelta = 0.0;
    var scaleSpeed = 0.01;


    const animateCube = () =>{
        var model = glMatrix.mat4.create();
        
        glMatrix.mat4.translate(model, model, [xCubeDelta, 0, zCubeDelta]);

        glMatrix.mat4.scale(model, model, [-.2, -.2, -.2]);
        var uModel = gl.getUniformLocation(shaderProgram, "uModel");
        var uView = gl.getUniformLocation(shaderProgram, "uView");
        var uProjection = gl.getUniformLocation(shaderProgram, "uProjection"); 
        gl.uniformMatrix4fv(uModel,false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        drawing(objects[4].vertices, objects[4].indices, objects[4].type);
    }

    const animate7 = () =>{
        var model = glMatrix.mat4.create();

        if (horizontalDelta >= (frameWidth/2+1) || horizontalDelta <= (-frameWidth/2+4)) {
            horizontalSpeed = horizontalSpeed * -1;
        }
        horizontalDelta += horizontalSpeed;
        glMatrix.mat4.translate(model, model, [horizontalDelta, -6, 0]);
        
        glMatrix.mat4.scale(model, model, [scaler, scaler, scaler]);
        var uModel = gl.getUniformLocation(shaderProgram, "uModel");
        var uView = gl.getUniformLocation(shaderProgram, "uView");
        var uProjection = gl.getUniformLocation(shaderProgram, "uProjection"); 
        gl.uniformMatrix4fv(uModel,false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        drawing(objects[0].vertices, objects[0].indices, objects[0].type);
    }
    
    const animate1 = () =>{
        var model = glMatrix.mat4.create();

        //scale 2x lipat (maju 1 unit z), scale 0.5x kalo lipat (mundur 0.5 unit z)
        if (scaleDelta >= 1 || scaleDelta <= -0.5) { 
            scaleSpeed = scaleSpeed * -1;
        }
        scaleDelta += scaleSpeed;
        glMatrix.mat4.translate(model, model, [1, -5.5, scaleDelta]);
        
        glMatrix.mat4.scale(model, model, [scaler, scaler, scaler]);
        var uModel = gl.getUniformLocation(shaderProgram, "uModel");
        var uView = gl.getUniformLocation(shaderProgram, "uView");
        var uProjection = gl.getUniformLocation(shaderProgram, "uProjection"); 
        gl.uniformMatrix4fv(uModel,false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        drawing(objects[1].vertices, objects[1].indices, objects[1].type);
    }

    const animateU = () =>{
        var model = glMatrix.mat4.create();

        glMatrix.mat4.rotate(model, model, xDelta, [0, 1, 0]);
        
        glMatrix.mat4.translate(model, model, [2.7, 2, 0]);
        glMatrix.mat4.scale(model, model, [scaler, scaler, scaler]);        
        var uModel = gl.getUniformLocation(shaderProgram, "uModel");
        var uView = gl.getUniformLocation(shaderProgram, "uView");
        var uProjection = gl.getUniformLocation(shaderProgram, "uProjection"); 
        gl.uniformMatrix4fv(uModel,false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        drawing(objects[2].vertices, objects[2].indices, objects[2].type);
    }
    const animateS = () =>{
        var model = glMatrix.mat4.create();

        glMatrix.mat4.rotateX(model, model, yDelta);
        
        glMatrix.mat4.translate(model, model, [2.5, -0.5, 0])
        glMatrix.mat4.scale(model, model, [scaler, scaler, scaler]);
        var uModel = gl.getUniformLocation(shaderProgram, "uModel");
        var uView = gl.getUniformLocation(shaderProgram, "uView");
        var uProjection = gl.getUniformLocation(shaderProgram, "uProjection"); 
        gl.uniformMatrix4fv(uModel,false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        drawing(objects[3].vertices, objects[3].indices, objects[3].type);
    }
    
    const render = () => {  
        gl.clearColor(0.0, 0.0, 0.0, 1.0); //(R G B A)
        // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
        var model = glMatrix.mat4.create();
        // glMatrix.mat4.translate(model, model, [0, 0, 0.0]);
        
        var uModel = gl.getUniformLocation(shaderProgram, "uModel");
        var uView = gl.getUniformLocation(shaderProgram, "uView");
        var uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
        gl.uniformMatrix4fv(uModel,false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        
        animate7();
        animateU();
        animateCube();
        // animate1(); //disabled
        // animateS(); //disabled
        
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // event handler
    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        if (keyName === 'ArrowUp') {
            yDelta += 0.1;
        } else if (keyName === 'ArrowDown') {
            yDelta -= 0.1;
        } else if (keyName === 'ArrowLeft') {
            xDelta -= 0.1;
        } else if (keyName === 'ArrowRight') {
            xDelta += 0.1;
        }
        else if (keyName ===  'i') {
            zCubeDelta += 0.1;
        }
        else if (keyName === 'k') {
            zCubeDelta -= 0.1;
        
        } else if (keyName === 'j') {
            xCubeDelta += 0.1;
        
        } else if (keyName === 'l') {
            xCubeDelta -= 0.1;
        }
    });

    // form cube 
    const verticesCube = [
        1.0, 1.0, 1.0,      1, 1, 1,
       -1.0, 1.0, 1.0,      1, 1, 1,
       -1.0,-1.0, 1.0,      1, 1, 1,
        1.0,-1.0, 1.0,      1, 1, 1, // v0-v1-v2-v3 front white
        1.0, 1.0, 1.0,      1, 1, 1,
        1.0,-1.0, 1.0,      1, 1, 1,
        1.0,-1.0,-1.0,      1, 1, 1,
        1.0, 1.0,-1.0,      1, 1, 1, // v0-v3-v4-v5 right(white)
        1.0, 1.0, 1.0,      1, 1, 1,
        1.0, 1.0,-1.0,      1, 1, 1,
       -1.0, 1.0,-1.0,      1, 1, 1,
       -1.0, 1.0, 1.0,      1, 1, 1,  // v0-v5-v6-v1 up
       -1.0, 1.0, 1.0,      1, 1, 1,
       -1.0, 1.0,-1.0,      1, 1, 1,
       -1.0,-1.0,-1.0,      1, 1, 1,
       -1.0,-1.0, 1.0,      1, 1, 1,  // v1-v6-v7-v2 left
       -1.0,-1.0,-1.0,      1, 1, 1,
        1.0,-1.0,-1.0,      1, 1, 1,
        1.0,-1.0, 1.0,      1, 1, 1,
       -1.0,-1.0, 1.0,      1, 1, 1,   // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,      1, 1, 1,
       -1.0,-1.0,-1.0,      1, 1, 1,
       -1.0, 1.0,-1.0,      1, 1, 1,
        1.0, 1.0,-1.0,      1, 1, 1,   // v4-v7-v6-v5 back
     ];

     const indicesCube = [
        0, 1, 2,   0, 2, 3,    
        4, 5, 6,   4, 6, 7,    
        8, 9,10,   8,10,11,    
        12,13,14,  12,14,15,    
        16,17,18,  16,18,19,    
        20,21,22,  20,22,23,
        24,25,26,   24,26,27,     
        28,29,30,   28,30,31,     
     ];

    //f form 7
    const vertices7 = [
        //vertices form number 7
        -0.8, 0.9,  0.0,     1, 0, 0, 

        -0.5, 0.9,  0.0,     1, 0, 0,
        -0.5, 0.9,  0.1,     1, 1, 0,
        -0.5, 0.9,  0.0,     1, 0, 0,

        -0.5, 0.82, 0.0,     1, 0, 0,
        -0.5, 0.82, 0.1,     1, 1, 0,
        -0.5, 0.82, 0.0,     1, 0, 0,
        
        -0.7, 0.5,  0.0,     1, 0, 0,
        -0.7, 0.5,  0.1,     1, 1, 0,
        -0.7, 0.5,  0.0,     1, 0, 0,

        -0.8, 0.5,  0.0,     1, 0, 0,
        -0.8, 0.5,  0.1,     1, 1, 0,
        -0.8, 0.5,  0.0,     1, 0, 0,

        -0.6, 0.82, 0.0,     1, 0, 0, 
        -0.6, 0.82, 0.1,     1, 1, 0, 
        -0.6, 0.82, 0.0,     1, 0, 0, 

        -0.8, 0.82, 0.0,     1, 0, 0, 
        -0.8, 0.82, 0.1,     1, 1, 0, 
        -0.8, 0.82, 0.0,     1, 0, 0,
        
        -0.8, 0.9,  0.0,     1, 0, 0, // transisi
        -0.8, 0.9,  0.1,     0, 0, 1, 

        -0.5, 0.9,  0.1,     0, 0, 1,
        -0.5, 0.82, 0.1,     0, 0, 1,
        -0.7, 0.5,  0.1,     0, 0, 1,
        -0.8, 0.5,  0.1,     0, 0, 1,
        -0.6, 0.82, 0.1,     0, 0, 1,
        -0.8, 0.82, 0.1,     0, 0, 1,
        
        -0.8, 0.82,  0.1,     0, 0, 1,
        -0.8, 0.9,  0.1,     1, , 1,
    ];
    const indices7 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 
        20, 21, 22, 23, 24, 25, 27, 28
    ];
    // drawing(vertices7, 0, 7); 
    
    // form 1
    const vertices1 = [
        -0.3, 0.9,   0.0,  1, 1, 0,

        -0.2, 0.9,   0.0,  0, 0, 1,
        -0.2, 0.9,   0.1,  0, 0, 1,
        -0.2, 0.9,   0.0,  0, 0, 1,

        -0.2, 0.58,  0.0,  0, 0, 1,
        -0.2, 0.58,  0.1,  0, 0, 1,
        -0.2, 0.58,  0.0,  0, 0, 1,

        -0.15, 0.58, 0.0,  0, 0, 1,
        -0.15, 0.58, 0.1,  0, 0, 1,
        -0.15, 0.58, 0.0,  0, 0, 1,

        -0.15, 0.5,  0.0,  0, 0, 1,
        -0.15, 0.5,  0.1,  0, 0, 1,
        -0.15, 0.5,  0.0,  0, 0, 1,
        
        -0.35, 0.5,  0.0,  0, 0, 1,
        -0.35, 0.5,  0.1,  0, 0, 1,
        -0.35, 0.5,  0.0,  0, 0, 1,

        -0.35, 0.58, 0.0,  0, 0, 1,
        -0.35, 0.58, 0.1,  0, 0, 1,
        -0.35, 0.58, 0.0,  0, 0, 1,

        -0.3, 0.58,  0.0,  0, 0, 1,
        -0.3, 0.58,  0.1,  0, 0, 1,
        -0.3, 0.58,  0.0,  0, 0, 1,

        -0.3, 0.8,   0.0,  0, 0, 1,
        -0.3, 0.8,   0.1,  0, 0, 1,
        -0.3, 0.8,   0.0,  0, 0, 1,

        -0.35, 0.8,  0.0,  0, 0, 1,
        -0.35, 0.8,  0.1,  0, 0, 1,
        -0.35, 0.8,  0.0,  0, 0, 1,

        -0.35, 0.85, 0.0,  0, 0, 1,
        -0.35, 0.85, 0.1,  0, 0, 1,
        -0.35, 0.85, 0.0,  0, 0, 1,

        -0.3, 0.9,   0.0,  0, 0, 1,  // transition
        -0.3, 0.9,   0.1,  1, 0, 0,  // transition
        -0.2, 0.9,   0.1,  1, 0, 0,
        
        -0.2, 0.58,  0.1,  1, 0, 0,
        -0.15, 0.58, 0.1,  1, 0, 0,
        
        -0.15, 0.5,  0.1,  1, 0, 0,
        -0.35, 0.5,  0.1,  1, 0, 0,
        
        -0.35, 0.58, 0.1,  1, 0, 0,
        -0.3, 0.58,  0.1,  1, 0, 0,
        
        -0.3, 0.8,   0.1,  1, 0, 0,
        -0.35, 0.8,  0.1,  1, 0, 0,

        -0.35, 0.85, 0.1,  1, 0, 0,
        
        -0.3, 0.9,   0.1,  1, 0, 0,  // transition
    ];
    var indices1 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 
        22, 23, 24, 25, 26, 26, 27, 28, 28, 29, 30, 
        30, 31, 32, 32, 33, 34, 34, 35, 36, 36, 37, 
        38, 38, 39, 40, 41, 42, 43
    ];
    
    // form u
    const verticesU = [
        //vertices form number U
        //back-side
        -0.9, 0.4, 0.0,     1,0,1,//a
        -0.8, 0.3, 0.0,     1,0,1, //b
        -0.9, 0.0, 0.0,     1,0,1,//c
    
        -0.8, 0.0, 0.0,     1,0,1,//bcd
        -0.8, -0.1,0.0,     1,0,1, //cde
        -0.6, 0.0, 0.0,     1,0,1,//def
     
        -0.6, -0.1,0.0,     1,0,1,//efg
        
        -0.5, 0.0, 0.0,     1,0,1,//fgh
        -0.6, 0.3, 0.0,     1,0,1,//ghi
        -0.5, 0.4, 0.0,     1,0,1,//hij

        //side face
        //in-top
        -0.5, 0.4, 0.0,     0,0,1,//a
        -0.5, 0.4, 0.1,     0,0,1,//b
        -0.6, 0.3, 0.0,     0,0,1, //c
        -0.6, 0.3, 0.1,     0,0,1,//d

        //in-side
        -0.6, 0.3, 0.0,     0,0,1,//c
        -0.6, 0.3, 0.1,     0,0,1,//d
        -0.6, 0.0, 0.0,     0,0,1,//def
        -0.6, 0.0, 0.1,     0,0,1,//def

        //in-bottom
        -0.6, 0.0, 0.0,     0,0,1,//def
        -0.6, 0.0, 0.1,     0,0,1,//def
        -0.8, 0.0, 0.0,     0,0,1,//bcd
        -0.8, 0.0, 0.1,     0,0,1,//bcd

        //in-side
        -0.8, 0.0, 0.0,     0,0,1,//bcd
        -0.8, 0.0, 0.1,     0,0,1,//bcd
        -0.8, 0.3, 0.0,     0,0,1,//c
        -0.8, 0.3, 0.1,     0,0,1,//d

        //in-top
        -0.8, 0.3, 0.0,     0,0,1,//c
        -0.8, 0.3, 0.1,     0,0,1,//d
        -0.9, 0.4, 0.0,     0,0,1,//a
        -0.9, 0.4, 0.1,     0,0,1,//b

        //out-side
        -0.9, 0.4, 0.0,     0,0,1,//a
        -0.9, 0.4, 0.1,     0,0,1,//b
        -0.9, 0.0, 0.0,     0,0,1,//a
        -0.9, 0.0, 0.1,     0,0,1,//b

        //out-corner
        -0.9, 0.0, 0.0,     0,0,1,//a
        -0.9, 0.0, 0.1,     0,0,1,//b
        -0.8, -0.1,0.0,     0,0,1,//a
        -0.8, -0.1,0.1,     0,0,1,//b

        //out-bottom
        -0.8, -0.1,0.0,     0,0,1,//a
        -0.8, -0.1,0.1,     0,0,1,//b
        -0.6, -0.1,0.0,     0,0,1,//a
        -0.6, -0.1,0.1,     0,0,1,//b

        //out-corner
        -0.6, -0.1,0.0,     0,0,1,//a
        -0.6, -0.1,0.1,     0,0,1,//b
        -0.5, 0.0, 0.0,     0,0,1,//a
        -0.5, 0.0, 0.1,     0,0,1,//b

        //out-side
        -0.5, 0.0, 0.0,     0,0,1,//a
        -0.5, 0.0, 0.1,     0,0,1,//b
        -0.5, 0.4, 0.0,     0,0,1,//a
        -0.5, 0.4, 0.1,     0,0,1,//b

        //front-side
        -0.5, 0.4, 0.1,     1,0,1,//hij
        -0.6, 0.3, 0.1,     1,0,1,//ghi
        -0.5, 0.0, 0.1,     1,0,1,//fgh
        -0.6, -0.1,0.1,     1,0,1,//efg
        -0.6, 0.0, 0.1,     1,0,1,//def
        -0.8, -0.1,0.1,     1,0,1, //cde
        -0.8, 0.0, 0.1,     1,0,1,//bcd
        -0.9, 0.0, 0.1,     1,0,1,//c
        -0.8, 0.3, 0.1,     1,0,1, //b
        -0.9, 0.4, 0.1,     1,0,1,//a

    ];
    const indicesU = [
        0, 1, 2, 
        3, 4, 5, 
        6, 7, 8, 
        9, 
        10, 11, 12, 13,
        14, 15, 16, 17,
        18, 19, 20, 21,
        22, 23, 24, 25,
        26, 27, 28, 29,
        30, 31, 32, 33,
        34, 35, 36, 37,
        38, 39, 40, 41,
        42, 43, 44, 45,
        46, 47, 48, 49,
        50, 51, 52, 53, 54, 
        55, 56, 57, 58,
        59
    ];
 

    // form S
    const verticesS = [
        //vertices form number S
        //back-face
        -0.1, 0.4, 0.0,     1,0,1,//a
        -0.0, 0.3, 0.0,     1,0,1,//b
        -0.3, 0.4, 0.0,     1,0,1,//c
        
        -0.3, 0.3, 0.0,     1,0,1,//bcd
        -0.4, 0.3, 0.0,     1,0,1,//cde
        -0.3, 0.2, 0.0,     1,0,1,//eff
        
        -0.4, 0.2, 0.0,     1,0,1,//deg
        -0.3, 0.1, 0.0,     1,0,1,//fgh
        -0.1, 0.2, 0.0,     1,0,1,//ghi
        
        -0.1, 0.1, 0.0,     1,0,1,//hij
        -0.0, 0.1, 0.0,     1,0,1,//ijk
        -0.1, 0.0, 0.0,     1,0,1,//jkl
        
        -0.0, 0.0, 0.0,     1,0,1,//klm
        -0.1, -0.1,0.0,     1,0,1, //lmn
        -0.4, 0.0, 0.0,     1,0,1,//mno
        -0.3, -0.1, 0.0,    1,0,1,//mno

        //out-end
        -0.4, 0.0, 0.0,     0,0,1,//mno
        -0.3, -0.1, 0.0,    0,0,1,//mno
        -0.3, -0.1, 0.1,    0,0,1,//mno
        -0.4, 0.0, 0.1,     0,0,1,//mno
        -0.4, 0.0, 0.0,     0,0,1,//mno

        // //in-bottom-side
        -0.1, 0.0, 0.1,     0,0,1,//klm
        -0.1, 0.0, 0.0,     0,0,1,//klm
        -0.1, 0.1, 0.1,     0,0,1,//klm
        -0.1, 0.1, 0.0,     0,0,1,//klm

        // //in-middle-bottom
        -0.3, 0.1, 0.1,     0,0,1,//klm
        -0.3, 0.1, 0.0,     0,0,1,//klm

        // //out-middle-corner
        -0.4, 0.2, 0.0,     0,0,1,//klm
        -0.4, 0.2, 0.1,     0,0,1,//klm
        
        // //out-side-top
        -0.4, 0.3, 0.0,     0,0,1,//klm
        -0.4, 0.3, 0.1,     0,0,1,//klm

        // //out-top-corner
        -0.3, 0.4, 0.0,     0,0,1,//klm
        -0.3, 0.4, 0.1,     0,0,1,//klm

        // //out-top
        -0.1, 0.4, 0.0,     0,0,1,//klm
        -0.1, 0.4, 0.1,     0,0,1,//klm

        // //top-end
        -0.0, 0.3, 0.0,     0,0,1,//klm
        -0.0, 0.3, 0.1,     0,0,1,//klm

        // //in-top
        -0.3, 0.3, 0.0,     0,0,1,//klm
        -0.3, 0.3, 0.1,     0,0,1,//klm

        // //in-top-side
        -0.3, 0.2, 0.0,     0,0,1,//klm
        -0.3, 0.2, 0.1,     0,0,1,//klm

        // //in-middle-top
        -0.1, 0.2, 0.0,     0,0,1,//klm
        -0.1, 0.2, 0.1,     0,0,1,//klm

        // //in-middle-corner
        -0.0, 0.1, 0.0,     0,0,1,//klm
        -0.0, 0.1, 0.1,     0,0,1,//klm

        // //in-middle-side
        -0.0, 0.0, 0.0,     0,0,1,//klm
        -0.0, 0.0, 0.1,     0,0,1,//klm

        // //in-bottom-corner
        -0.1, -0.1,0.0,     0,0,1,//klm
        -0.1, -0.1,0.1,     0,0,1,//klm

        // //in-bottom-side
        -0.3, -0.1,0.0,     0,0,1,//klm
        -0.3, -0.1,0.1,     0,0,1,//klm

        // //front-face
        -0.3, -0.1,0.1,    1,0,1,//mno
        -0.4, 0.0, 0.1,     1,0,1,//mno
        -0.1, -0.1,0.1,     1,0,1, //lmn
        -0.0, 0.0, 0.1,     1,0,1,//klm
        -0.1, 0.0, 0.1,     1,0,1,//jkl
        -0.0, 0.1, 0.1,     1,0,1,//ijk
        -0.1, 0.1, 0.1,     1,0,1,//hij
        -0.1, 0.2, 0.1,     1,0,1,//ghi
        -0.3, 0.1, 0.1,     1,0,1,//fgh
        -0.4, 0.2, 0.1,     1,0,1,//deg
        -0.3, 0.2, 0.1,     1,0,1,//eff
        -0.4, 0.3, 0.1,     1,0,1,//cde
        -0.3, 0.3, 0.1,     1,0,1,//bcd
        -0.3, 0.4, 0.1,     1,0,1,//c
        -0.0, 0.3, 0.1,     1,0,1,//b
        -0.1, 0.4, 0.1,     1,0,1,//a
    ];
    const indicesS =[
        0,1,2,3,4,5,6,7,8,9,10,11,12,
        13,14,15,16,17,
        18,19,20,21,
        22,23,
        24,25,
        26,27,
        28,29,
        30,31,
        32,33,
        34,35,
        36,37,
        38,39,
        40,41,
        42,43,
        44,45,
        46,47,
        48,49,
        50,51,
        52,53,54,55,56,57,58,59,60,61,62,63,64,65,66
    ]

    const objects = [
        {
            name: '7',
            vertices: vertices7,
            indices: indices7,
            length: 7,
            type: gl.LINE_LOOP,
        },
        {
            name: '1',
            vertices: vertices1,
            indices : indices1,
            length: 11,
            type: gl.LINE_LOOP
        },
        {
            name: 'U',
            vertices: verticesU,
            indices: indicesU,
            length: 10,
            type: gl.TRIANGLE_STRIP,
        },
        {
            name: 'S',
            vertices: verticesS,
            indices: indicesS,
            length: 16,
            type: gl.TRIANGLE_STRIP,
        },
        {
            name: 'cube',
            vertices: verticesCube,
            indices: indicesCube,
            length: 7,
            type: gl.TRIANGLES,
        },
    ]
    console.log(objects);


}