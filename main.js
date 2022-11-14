const main = () =>{
    const canvas = document.querySelector('#kanvas');
    const gl = canvas.getContext('webgl');
    
    const buffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

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
        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
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
    var freeze = false;
    var horizontalSpeed = 0.171; //nrp
    var verticalSpeed = 0.0;
    var horizontalDelta = 0.0;
    var verticalDelta = 0.0;

    
    // variable pointer ke GLSL
    var uModel = gl.getUniformLocation(shaderProgram, "uModel");
    // View
    var cameraX = 0.0;
    var cameraZ = 7.5;
    var uView = gl.getUniformLocation(shaderProgram, "uView");
    var view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
        view,
        [cameraX, 0.0, cameraZ],    // the location of the eye or the camera
        [cameraX, 0.0, 0],        // the point where the camera look at
        [0.0, 1.0, 0.0]
    );
    // Projection
    var uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
    var perspective = glMatrix.mat4.create();
    glMatrix.mat4.perspective(perspective, Math.PI/2.4, 1.0, 0.5, 50.0);




    // bind attribute : told gpu how to collect position value from buffer to  every vertex that processing 
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    const aColor = gl.getAttribLocation(shaderProgram, 'aColor');
        
    
    // drawing function
    const drawing = (vertices, indices, start=0, end, glType=gl.LINE_LOOP) =>{        
        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 
            6 * Float32Array.BYTES_PER_ELEMENT, 
            0 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(aPosition);
        
        // gl.drawArrays(glType, start, end);
        
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 
            6 * Float32Array.BYTES_PER_ELEMENT, 
            3 * Float32Array.BYTES_PER_ELEMENT 
            );
        gl.enableVertexAttribArray(aColor);
        
        gl.drawElements(glType,indices.length, gl.UNSIGNED_SHORT, 0);
    }

    const frameWidth = 12.4 //in mat4 unit
    const render = (object) => {    
        gl.clearColor(0.0, 1.0, 1.0, 1.0); //(R G B A)
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (!freeze) {
            theta += 0.1;
        }
        verticalDelta -= verticalSpeed;
        var model = glMatrix.mat4.create();
        // glMatrix.mat4.rotateY(
            //     model,
            //     model,
            //     [1]
            //     // theta * Math.PI / 100
            // ) 
        // bounching
        if (horizontalDelta >= (frameWidth/2) || horizontalDelta <= (-frameWidth/2+1)) {
            horizontalSpeed = horizontalSpeed * -1;
        } 
        horizontalDelta += horizontalSpeed;
        glMatrix.mat4.translate(model, model, [horizontalDelta, verticalDelta, 0.0]);
            
            
        gl.uniformMatrix4fv(uModel,false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        objects.map((object) => {
            drawing(object.vertices, object.indices, 0, object.length, object.type);
        });
        // gl.drawArrays(gltype, start, end);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    
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
        // {
        //     vertices: verticesU,
        //     length: 10,
        //     type: gl.TRIANGLE_STRIP,
        // },
        // {
        //     vertices: verticesS,
        //     length: 16,
        //     type: gl.TRIANGLE_STRIP,
        // },
    ]
    console.log(objects);


}