class MyChecker extends MyPiece {

    /**
     * @constructor
     * @param  scene   represents the CGFscene
     * @param type     may be whiteOrc,purpleOrc,zombie  
     * @param player             
     */
     

    constructor(scene, type,player) {
        super(scene,type,player);
        this.checker = new CGFOBJModel(this.scene, 'models/checker.obj');
         

    }




display(){

    this.scene.pushMatrix();
    this.scene.scale(5, 5, 5);
    if(this.type=="whiteOrc"){}//mudar para a textura branca
    if(this.type=="purpleOrc"){}//mudar para textura roxa
    if(this.type=="zombie"){}//mudar para textura verde


    this.checker.display();
    this.scene.popMatrix();
    

}















}