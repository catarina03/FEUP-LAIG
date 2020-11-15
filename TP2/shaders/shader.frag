varying mediump vec2 TextureCoord;
uniform sampler2D Sampler;

void main(void)
{
    // Using my TextureCoord just draws a grey square, so
    // I'm likely generating texture coords that texture2D doesn't like.
    gl_FragColor = texture2D(Sampler, TextureCoord);

    // Using gl_PointCoord just draws my whole sprite map
    // gl_FragColor = texture2D(Sampler, gl_PointCoord);
}