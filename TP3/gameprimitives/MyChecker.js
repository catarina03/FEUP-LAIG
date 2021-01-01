class MyChecker extends MyPiece {

    /**
     * @constructor
     * @param  scene   represents the CGFscene
     * @param type     may be whiteOrc,purpleOrc,zombie  
     * @param player             
     */
     

    constructor(scene, player, tileID, xCoord, zCoord) {
        super(scene,player);
        //this.checker = new CGFOBJModel(this.scene, 'models/checker.obj');
        this.checker = new MyCylinder(scene, 0.4, 0.4, 0.15, 20, 3);
        this.pickId = null;
        this.xCoord = xCoord;
        this.yCoord = 0.2;
        this.zCoord = zCoord;

        this.checkerStates = {
            NOT_SELECTED: 0,
            SELECTED: 1
        }
        this.currentState = 0;

        this.tileID = tileID;

        this.zombie = new CGFappearance(scene);
        this.zombie.setAmbient(0.1, 0.1, 0.1, 1);
        this.zombie.setShininess(0.1);
        this.zombie.setDiffuse(0.1,0.8,0.1,1.0);
        this.zombie.setSpecular(0.1,0.1,0.1,1.0);

        this.orc = new CGFappearance(scene);
        this.orc.setAmbient(0.1, 0.1, 0.1, 1);
        this.orc.setDiffuse(1,1,1,0.0);
        this.orc.setSpecular(1,1,1,0.0);
        this.orc.setShininess(0.1);

        this.goblin = new CGFappearance(scene);
        this.goblin.setAmbient(0.1, 0.1, 0.1, 1);
        this.goblin.setDiffuse(0.35,0,0.38,0.0);
        this.goblin.setSpecular(0.1,0.1,0.1,0.0);
        this.goblin.setShininess(0.1);

        this.selected = new CGFappearance(scene);
        this.selected.setAmbient(0.1, 0.1, 0.1, 1);
        this.selected.setShininess(0.1);
        this.selected.setDiffuse(0.61,0.04,0.04, 1.0);
        this.selected.setSpecular(0.1,0.1,0.1, 1.0);

        this.animation = null;
    }


    display(){
    
        this.scene.pushMatrix();
        
        if (this.currentState == this.checkerStates.SELECTED){
                this.selected.apply();
        }
        else {
            if(this.player =="o"){ //orc - white
                this.orc.apply();
            }
            if(this.player =="g"){ //goblin - purple
                this.goblin.apply();
            }
            if(this.player =="z"){ //zombie - green
                this.zombie.apply();
            }
        }
        
        if (this.animation != null){
            this.animation.apply();
        }   

        
        this.scene.translate(this.xCoord, this.yCoord, this.zCoord);
        this.scene.rotate(90*DEGREE_TO_RAD, 1, 0, 0);

        this.checker.display();

        this.scene.popMatrix();
        
    }



}