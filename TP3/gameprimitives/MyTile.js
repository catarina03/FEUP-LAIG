class MyTile extends CGFobject {

 //o tipo pode ser whiteEdge,purpleEdge,greenEdge
    constructor(scene, id, type, xCoord, zCoord) {

        super(scene, xCoord, zCoord);
        this.id = id;
        this.tile= new CGFOBJModel(this.scene, 'models/tile.obj');

        this.xCoord = xCoord;
        this.zCoord = zCoord;

    }





    display(){

        this.scene.pushMatrix();
        
        this.scene.translate(this.xCoord, 0, this.zCoord);  
        this.scene.rotate(30*DEGREE_TO_RAD, 0, 1, 0);     
        this.tile.display();


        this.scene.popMatrix();


    }


}