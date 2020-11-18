class MySpriteAnimation extends MySpriteSheet{
    constructor(scene, MySpriteSheet, duration, startCell, endCell){
        super(scene);

        this.spritesheet = MySpriteSheet;
        this.sideSize = 3;


        this.duration = duration;

        this.startCell = startCell; 
        this.currentCell = startCell;     
        this.endCell = endCell;
        this.timeElapsed = 0;
        this.startTime = 0;
        this.timeLastUpdate = 0;

        this.baseGeometry = new MyRectangle(this.scene, -this.sideSize/2, -this.sideSize/2, this.sideSize/2, this.sideSize/2)
        
    }


    update(currentTime){
        //Calculates animation start time
        if (this.timeElapsed == 0){
            this.startTime = currentTime;
            this.timeElapsed = currentTime;
            this.spritesheet.activateCellP(this.currentCell, this.sideSize);
        }

        let deltaTime = (currentTime - this.timeLastUpdate)/1000;

        if (this.timeElapsed >= this.duration){
            this.timeElapsed = this.timeElapsed % this.duration;
            this.currentCell += 1;
            this.currentCell = (this.currentCell - this.startCell) % (this.endCell - this.startCell + 1) + this.startCell;
            this.spritesheet.activateCellP(this.currentCell, this.sideSize);
        }

        this.timeElapsed += deltaTime;
        this.timeLastUpdate = currentTime;
    }



    display(){
        this.scene.pushMatrix();

        this.spritesheet.appearance.setTexture(this.spritesheet.texture);

        this.scene.setActiveShaderSimple(this.spritesheet.shader); // activate selected shader

        this.spritesheet.appearance.apply();
        this.baseGeometry.display();

        this.scene.setActiveShaderSimple(this.scene.defaultShader);

        this.scene.popMatrix();
    }




    
}