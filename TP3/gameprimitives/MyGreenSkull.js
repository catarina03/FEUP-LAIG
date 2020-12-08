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
    }




display(){
    this.scene.pushMatrix();
   
    this.scene.scale(0.3,0.3,0.3);

    this.skull.display();
    this.scene.popMatrix();
  



}













}