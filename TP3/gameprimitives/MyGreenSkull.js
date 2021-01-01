class MyGreenSkull extends CGFobject {

    /**
     * @constructor
     * @param  scene   represents the CGFscene           
     */

    constructor(scene) {
        super(scene);
        this.skull = new CGFOBJModel(scene, 'models/greenskull.obj');

        this.xCoord = 5;
        this.zCoord = -1;

        this.green = new CGFappearance(scene);
        this.green.setAmbient(0.1, 0.1, 0.1, 1);
        this.green.setDiffuse(0.06,0.38,0.13,0.0);
        this.green.setSpecular(0.1,0.1,0.1,0.0);
        this.green.setShininess(0.1);
    }




display(){
    this.scene.pushMatrix();
    this.scene.translate(this.xCoord, 0, this.zCoord);
    this.scene.scale(0.25, 0.25, 0.25);
    this.green.apply();
    this.skull.display();
    this.scene.popMatrix();
}













}