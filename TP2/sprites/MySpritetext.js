class MySpriteText extends MySpriteSheet{
    constructor(scene, texture, sizeM, sizeN, text){
        super(scene, texture, sizeM, sizeN);
        
        this.text = text;

        this.shader = null;

        console.log(scene)
        console.log(-this.sizeM/2)
        console.log(this.sizeM/2)
        console.log(-this.sizeN/2)
        console.log(this.sizeN/2)

        this.rectangle = new MyRectangle(scene, -this.sizeM/2, this.sizeM/2, -this.sizeN/2, this.sizeN/2)
    }

    
    display(){

        this.scene.setActiveShader(this.shader); // activate selected shader

        this.shader.bind(0); // bind RTTtexture
        this.rectangle.display();

        this.scene.setActiveShader(this.scene.defaultShader);



    }








    
}