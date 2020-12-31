class MyChecker extends MyPiece {

    /**
     * @constructor
     * @param  scene   represents the CGFscene
     * @param type     may be whiteOrc,purpleOrc,zombie  
     * @param player             
     */
     

    constructor(scene, player, tileID, xCoord, zCoord) {
        super(scene,player);
        this.checker = new CGFOBJModel(this.scene, 'models/checker.obj');
        this.pickId = null;
        this.xCoord = xCoord;
        this.yCoord = 0.1;
        this.zCoord = zCoord;

        this.checkerStates = {
            NOT_SELECTED: 0,
            SELECTED: 1
        }
        this.currentState = 0;

        this.tileID = tileID;

        this.colour = new CGFappearance(scene);

        this.colour.setAmbient(0.1, 0.1, 0.1, 1);
        this.colour.setShininess(1.0);

        if(this.player =="o"){ //orc - white
            
            this.colour.setDiffuse(1.0,1.0,1.0,0.0);
            this.colour.setSpecular(1.0,1.0,1.0,0.0);
        }
        if(this.player =="g"){ //goblin - purple
            this.colour.setDiffuse(0.1,0.1,0.8,0.8);
            this.colour.setSpecular(0.1,0.1,0.8,0.8);
        }
        if(this.player =="z"){ //zombie - green
            this.colour.setDiffuse(0.1,0.8,0.1,1.0);
            this.colour.setSpecular(0.1,0.8,0.1,1.0);
        }

        this.animation = null;
    }


    display(){
    
        this.scene.pushMatrix();
        
        if (this.currentState == this.checkerStates.SELECTED){
                this.colour.setDiffuse(0.61,0.04,0.04);
                this.colour.setSpecular(0.72,0.62,0.62);
        }
        else {
            if(this.player =="o"){ //orc - white
                this.colour.setDiffuse(1.0,1.0,1.0,0.0);
                this.colour.setSpecular(1.0,1.0,1.0,0.0);
            }
            if(this.player =="g"){ //goblin - purple
                this.colour.setDiffuse(0.1,0.1,0.8,0.8);
                this.colour.setSpecular(0.1,0.1,0.8,0.8);
            }
            if(this.player =="z"){ //zombie - green
                this.colour.setDiffuse(0.1,0.8,0.1,1.0);
                this.colour.setSpecular(0.1,0.8,0.1,1.0);
            }
        }
        this.colour.apply();
        
        if (this.animation != null){
            this.animation.apply();
        }   

        
        this.scene.translate(this.xCoord, this.yCoord, this.zCoord);
        this.scene.scale(0.8, 0.8, 0.8);
        
        //if (this.yCoord < 0.1) this.yCoord = 0.2;

        this.checker.display();

        this.scene.popMatrix();
        
    }



}