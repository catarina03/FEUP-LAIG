class MyTile extends CGFobject {

 //o tipo pode ser whiteEdge,purpleEdge,greenEdge
    constructor(scene, id, type, xCoord, zCoord) {
        super(scene, xCoord, zCoord);
        this.id = id;
        this.tile= new CGFOBJModel(this.scene, 'models/tile.obj');

        this.xCoord = xCoord;
        this.zCoord = zCoord;

        this.colour = new CGFappearance(scene);
        this.colour.setAmbient(0.1, 0.1, 0.1, 1);
        this.colour.setShininess(1.0);
        this.colour.setDiffuse(0.3, 0.3, 0.3, 0.0);
        this.colour.setSpecular(0.1, 0.1, 0.1, 0.0);
    }


    updateAnimation(time){
        //Updates this component's animation
        if (this.animation != null){
            if (this.animation.finished){
                return;
            }
            else{
                this.animation.update(time);
            }
        }
    }


    display(){
        this.scene.pushMatrix();

        this.colour.apply();
        this.scene.translate(this.xCoord, 0, this.zCoord);  
        this.scene.rotate(30*DEGREE_TO_RAD, 0, 1, 0);     
        this.tile.display();


        this.scene.popMatrix();
    }


}