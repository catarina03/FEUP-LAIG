class MyChecker extends MyPiece {

    /**
     * @constructor
     * @param  scene   represents the CGFscene
     * @param type     may be whiteOrc,purpleOrc,zombie  
     * @param player             
     */
     

    constructor(scene, type, player) {
        super(scene,type,player);
        this.checker = new CGFOBJModel(this.scene, 'models/checker.obj');

        this.colour = new CGFappearance(scene);

        this.colour.setAmbient(0.1, 0.1, 0.1, 1);
        this.colour.setShininess(1.0);

        if(this.type=="whiteOrc"){
            
            this.colour.setDiffuse(1.0,1.0,1.0,0.0);
            this.colour.setSpecular(1.0,1.0,1.0,0.0);
        }
        if(this.type=="purpleOrc"){
            this.colour.setDiffuse(0.1,0.1,0.8,0.8);
            this.colour.setSpecular(0.1,0.1,0.8,0.8);
        }
        if(this.type=="zombie"){
            this.colour.setDiffuse(0.1,0.8,0.1,1.0);
            this.colour.setSpecular(0.1,0.8,0.1,1.0);
             }
    
        this.colour.apply();
    }




display(){
    
    this.colour.apply();

    this.scene.pushMatrix();
    
    this.scene.translate(9.3, 0.1, 4.5);
    this.scene.scale(0.6, 0.6, 0.6);
    
    this.checker.display();

    this.scene.popMatrix();
    

}















}