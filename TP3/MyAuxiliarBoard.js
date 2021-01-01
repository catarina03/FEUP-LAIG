/**
 * MyAuxiliarBoard
 */
class MyAuxiliarBoard extends CGFobject{
    constructor(scene){
        super(scene);
        this.boardBase = null; 

        this.orcStack = -0.5
        this.goblinStack = -0.5
        this.zombieStack = -0.5


        this.brown = new CGFappearance(scene);
        this.brown.setAmbient(0.1, 0.1, 0.1, 1);
        this.brown.setDiffuse(0.34,0.22,0.13,0.0);
        this.brown.setSpecular(0.1,0.1,0.1,0.0);
        this.brown.setShininess(0.1);

        
        this.green = new CGFappearance(scene);
        this.green.setAmbient(0.1, 0.1, 0.1, 1);
        this.green.setDiffuse(0.06,0.38,0.13,0.0);
        this.green.setSpecular(0.1,0.1,0.1,0.0);
        this.green.setShininess(0.1);

        this.white = new CGFappearance(scene);
        this.white.setAmbient(0.1, 0.1, 0.1, 1);
        this.white.setDiffuse(0.5,0.5,0.5,0.0);
        this.white.setSpecular(0.1,0.1,0.1,0.0);
        this.white.setShininess(0.1);

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



        this.buildBoard();
    }

    
    buildBoard(){
        this.boardBase = new CGFOBJModel(this.scene, 'models/board.obj');


    }


    /*
    addPiece(pieceType, tile){
        piece.

    }
    */

    /*
    removePiece(){

    }
    */

    
    eatenPieceAnimation(piece) {
        console.log("Piece player: " + piece.player);
        let deltaX = null;
        let deltaZ = null;
        if (piece.player  == "o") {
            deltaX = 10.25 - piece.xCoord;
            deltaZ = 3.25 - piece.zCoord;
        } else if (piece.player == "g") {
            deltaX = 10.25 - piece.xCoord;
            deltaZ = 4.25 - piece.zCoord;
        } else if (piece.player == "z") {
            deltaX = 10.25 - piece.xCoord;
            deltaZ = 5.25 - piece.zCoord;
        }

        console.log(deltaX);
        console.log(deltaZ);

        let t = 0;

        let keyframe0 = new MyKeyframe(t, [vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
        let keyframe1 = new MyKeyframe(t + 0.5, [vec3.fromValues(deltaX/4, 5*Math.sin(45*DEGREE_TO_RAD), deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
        let keyframe2 = new MyKeyframe(t + 1, [vec3.fromValues(deltaX/2, 5*Math.sin(90*DEGREE_TO_RAD), deltaZ/2), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);

        let keyframe3;
        let keyframe4;
        if (piece.player == "o"){
            keyframe3 = new MyKeyframe(t + 1.5, [vec3.fromValues(3*deltaX/4, 5*Math.sin(45*DEGREE_TO_RAD) - this.orcStack/2, 3*deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
            keyframe4 = new MyKeyframe(t + 2, [vec3.fromValues(deltaX, this.orcStack, deltaZ), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
        } else if (piece.player == "g"){
            keyframe3 = new MyKeyframe(t + 1.5, [vec3.fromValues(3*deltaX/4, 5*Math.sin(45*DEGREE_TO_RAD) - this.goblinStack/2, 3*deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
            keyframe4 = new MyKeyframe(t + 2, [vec3.fromValues(deltaX, this.goblinStack, deltaZ), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
        } else if (piece.player == "z"){
            keyframe3 = new MyKeyframe(t + 1.5, [vec3.fromValues(3*deltaX/4, 5*Math.sin(45*DEGREE_TO_RAD) - this.zombieStack/2, 3*deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
            keyframe4 = new MyKeyframe(t + 2, [vec3.fromValues(deltaX, this.zombieStack, deltaZ), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
        }

        let keyframes = [keyframe0, keyframe1, keyframe2, keyframe3, keyframe4];

        let keyframeAnim = new MyKeyframeAnimation(this.scene, "movementAnimation");
        keyframeAnim.keyframes = keyframes;

        piece.animation = keyframeAnim;
    
    }


    updatePiece(piece){

        piece.animation = null;

        if (piece.player == "o"){
            piece.xCoord = 10.25;
            piece.zCoord = 3.25;
            piece.yCoord = this.orcStack;
            this.orcStack += 0.21;
        } else if (piece.player == "g"){
            piece.xCoord = 10.25;
            piece.zCoord = 4.25;
            piece.yCoord = this.goblinStack;
            this.goblinStack += 0.21;
        } else if (piece.player == "z"){
            piece.xCoord = 10.25;
            piece.zCoord = 5.25;
            piece.yCoord = this.zombieStack;
            this.zombieStack += 0.21;
        }


        return 0;
    }


    async eatPiece(piece){
        await this.sleep(1000);
        this.eatenPieceAnimation(piece);
        console.log("SLEEP");
        await this.sleep(2000);
        console.log("SLEEPED");
        this.updatePiece(piece); 
    }


    display(){
        this.scene.pushMatrix()
        //this.scene.translate(8.25, -1.5, -2.25);
        this.scene.translate(10.25, -1.5, -4.25);
        this.scene.rotate(45*DEGREE_TO_RAD, 0, 1, 0);
        this.scene.scale(0.05, 0.2, 0.2);
        this.brown.apply();
        this.boardBase.display();
        this.scene.popMatrix();
    }


    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}