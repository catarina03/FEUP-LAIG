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

uniform int line;
uniform int column;
uniform int sizeM;
uniform int sizeN;

void main(void)
{
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = aTextureCoord * vec2(0.5, 0.5);// * (1.0/10.0)) + vec2(0.1, 0.2);
    //gl_PointSize = PointSize;
}