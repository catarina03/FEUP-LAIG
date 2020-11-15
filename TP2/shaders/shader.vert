uniform mat4 Projection;
uniform mat4 Modelview;
uniform float PointSize;

attribute vec4 Position;
attribute vec2 TextureCoordIn;

varying vec2 TextureCoord;

void main(void)
{
    gl_Position = Projection * Modelview * Position;
    TextureCoord = TextureCoordIn;
    gl_PointSize = PointSize;
}