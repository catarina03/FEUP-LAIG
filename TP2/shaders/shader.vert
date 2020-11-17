// informação de cada vértice
attribute vec3 aVertexPosition;  // posição [x,y,z]
attribute vec3 aVertexNormal;    // normal [x,y,z]
attribute vec2 aTextureCoord;    // coordenadas de textura [s,t] - Tex-coords input to VS

// info comum a todos os vértice
// WebCGF-provided Input Variables (uniforms)
uniform mat4 uMVMatrix; // Model View matrix - Matrix onde são aplicadas as transformações
uniform mat4 uPMatrix;  // Projection matrix - Matrix com info da camara
uniform mat4 uNMatrix;	// Normal transformation matrix - Processa a normal associada ao vértice

varying vec2 vTextureCoord; // Tex-coords output from VS to be input to FS

uniform float row;
uniform float column;
uniform float sizeM;
uniform float sizeN;
uniform float textLength;
uniform float sideSize;

void main(void)
{
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = aTextureCoord * vec2(1.0/sizeM, 1.0/sizeN) + vec2(column/sizeM, row/sizeN);
}