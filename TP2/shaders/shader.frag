#ifdef GL_ES
precision highp float;
#endif 

varying vec2 vTextureCoord;  // coordenadas de textura interpoladas recebidas de VS
uniform sampler2D uSampler;  // recebe um identificador da textura a usar


// animação
//uniform float timeFactor;

void main(void)
{
    // Using my TextureCoord just draws a grey square, so
    // I'm likely generating texture coords that texture2D doesn't like.
    gl_FragColor = texture2D(uSampler, vTextureCoord);

    // Using gl_PointCoord just draws my whole sprite map
    // gl_FragColor = texture2D(Sampler, gl_PointCoord);
}