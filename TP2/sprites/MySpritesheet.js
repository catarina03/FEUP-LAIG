class MySpriteSheet extends CGFobject {

    constructor(scene, texture, sizeM, sizeN){
        super(scene);

        this.texture=texture;
        this.sizeM=sizeM;    //number of collumns
        this.sizeN=sizeN;    //number of lines

        this.shader = null; //new CGFshader(this.scene.gl, "../shaders/shader.vert", "../shaders/shader.frag");




    }





}