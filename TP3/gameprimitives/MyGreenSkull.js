class MyGreenSkull extends MyPiece {

    /**
     * @constructor
     * @param  scene   represents the CGFscene
     * @param type     greenSkull  
     * @param player             
     */

    constructor(scene, type,player) {
        super(scene,type,player);
        this.skull = new CGFOBJModel(this.scene, 'models/greenskull.obj');


        this.colour = new CGFappearance(scene);

        this.colour.setAmbient(0.1, 0.1, 0.1, 1);
        this.colour.setShininess(1.0);

        this.colour.setDiffuse(0.1,0.8,0.1,1.0);
        this.colour.setSpecular(0.1,0.8,0.1,1.0);

        this.colour.apply();
    }




display(){
    this.colour.apply();
    this.scene.pushMatrix();
   
    this.scene.scale(0.3,0.3,0.3);

    this.skull.display();
    this.scene.popMatrix();
  



}













}