class MyTile extends CGFobject {

 //o tipo pode ser whiteEdge,purpleEdge,greenEdge
    constructor(scene,type) {

        super(scene);
        this.tile= new CGFOBJModel(this.scene, 'models/tile.obj');

    }





    display(){

        this.scene.pushMatrix();

        this.scene.scale(3, 3, 3);
        
        
        this.tile.display();


        this.scene.popMatrix();


    }


}