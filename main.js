const main =()=>{
    const canvas = document.querySelector('#c');
    const gl = canvas.getContext('webgl');
    if(!gl){
        return;
    }
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}