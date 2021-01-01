/**
 * MyGameBoard
 */
class MyGameBoard extends CGFobject{
    constructor(scene){
        super(scene);
        this.boardCells = [];
        //this.aux = [];
        this.checkers = [];

        this.boardBase = null; 
        this.leftHolder = null;
        this.rightHolder = null;
        this.skull = null;

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
        this.populateBoard();
    }


    populateBoard(){
        //Zombies
        for(let i = 2; i < 4; i++){
            for(let j = 0; j <= i; j++){
                if (j == 0){
                    let piece = new MyChecker(this.scene, "z", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                    this.checkers[i*10+j] = piece;
                }
                if (j == i){
                    let piece = new MyChecker(this.scene, "z", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                    this.checkers[i*10+j] = piece;
                }
            }
        }
        for(let i = 4; i < 7; i++){
            for(let j = 0; j <= i; j++){
                console.log(i + "/" + j);
                if (this.boardCells[i].length % 2 == 1 && j == Math.ceil(i/2)){
                    console.log("Zombie middle: " + i + "/" + j);
                    let piece = new MyChecker(this.scene, "z", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                    this.checkers[i*10+j] = piece;
                }
                else {
                    if(j == Math.floor(i/2) || j == Math.ceil(i/2)){
                        let piece = new MyChecker(this.scene, "z", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                        this.checkers[i*10+j] = piece;
                    }
                }
            }

        }
        for(let i = 6; i < 10; i++){
            //Orcs
            for (let j = 0; j <= i-6; j++){
                let piece = new MyChecker(this.scene, "g", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                this.checkers[i*10+j] = piece;
            }
    
            //Goblins
            for (let j = 6; j <= i; j++){
                let piece = new MyChecker(this.scene, "o", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                this.checkers[i*10+j] = piece;
            }
        }
        
    }
    
    buildBoard(){
        for(let i = 0; i < 10; i++){
            let aux = [];

            for(let j = 0; j <= i; j++){
                let id = i*10 + j;
                let cell = new MyTile(this.scene, id, "type", j - i/2, i);
                aux[j] = cell;
            }
            this.boardCells[i] = aux;
        }

        //this.leftTriangle = new MyTriangle(this.scene, 0, 0, 2, 0, 0.4, 0.85);
        //this.rightTriangle = new MyTriangle(this.scene, 0, 0, 0.4, -0.85, 2, 0);

        this.boardBase = new CGFOBJModel(this.scene, 'models/board.obj');
        this.leftHolder = new CGFOBJModel(this.scene, 'models/tile.obj');
        this.rightHolder = new CGFOBJModel(this.scene, 'models/tile.obj');
        this.skull = new MyGreenSkull(this.scene);




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

    
   movePieceAnimation(piece, newTile) {
    let deltaX = newTile.xCoord - piece.xCoord;
    let deltaZ = newTile.zCoord - piece.zCoord;

    let t = 0;


    let keyframe0 = new MyKeyframe(t, [vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
    let keyframe1 = new MyKeyframe(t + 0.25, [vec3.fromValues(deltaX/4, Math.sin(45*DEGREE_TO_RAD), deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
    let keyframe2 = new MyKeyframe(t + 0.5, [vec3.fromValues(deltaX/2, Math.sin(90*DEGREE_TO_RAD), deltaZ/2), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
    let keyframe3 = new MyKeyframe(t + 0.75, [vec3.fromValues(3*deltaX/4, Math.sin(45*DEGREE_TO_RAD), 3*deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);
    let keyframe4 = new MyKeyframe(t + 1, [vec3.fromValues(deltaX, 0, deltaZ), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);

    let keyframes = [keyframe0, keyframe1, keyframe2, keyframe3, keyframe4];

    let keyframeAnim = new MyKeyframeAnimation(this.scene, "movementAnimation");
    keyframeAnim.keyframes = keyframes;

    piece.animation = keyframeAnim;
    
    }


    updatePiece(piece, tile){

        piece.animation = null;
        piece.tileID = tile.id;//(destination[0]-1)*10 + destination[1]-1;
        piece.xCoord = tile.xCoord;
        piece.zCoord = tile.zCoord;
        piece.yCoord = 0.2;

        return 0;
    }


    async movePiece(piece, newTile){
        this.movePieceAnimation(piece, newTile);
        console.log("SLEEP");
        await this.sleep(1000);
        console.log("SLEEPED");
        this.updatePiece(piece, newTile); 
    }


    display(){

        this.scene.pushMatrix();
        this.scene.rotate(45*DEGREE_TO_RAD, 0, 1, 0);

        for (let i = 0; i < this.boardCells.length; i++) {

            for (let j = 0; j < this.boardCells[i].length; j++) {
                this.scene.registerForPick(i*10 + j, this.boardCells[i][j]);
                this.boardCells[i][j].display();
                
            }

        }

        let counter = 1;
        for(let checker in this.checkers){
            this.scene.registerForPick(99 + counter, this.checkers[checker]);
            //this.checkers[checker].pickId = 99 + counter;
            this.checkers[checker].display();
            counter++;
        }
        this.scene.popMatrix();

        this.scene.pushMatrix()
        this.scene.translate(3.25, -1.5, 3.25);
        this.scene.rotate(45*DEGREE_TO_RAD, 0, 1, 0);
        this.scene.scale(0.35, 0.35, 0.35);
        this.brown.apply();
        this.scene.registerForPick(200, this.boardBase);
        this.boardBase.display();
        this.scene.popMatrix();

        //Orc holder
        this.scene.pushMatrix();
        this.scene.translate(5, 0, -1);
        this.scene.scale(2, 1, 2);
        this.scene.rotate(45*DEGREE_TO_RAD, 0, 1, 0);
        this.goblin.apply();
        this.scene.registerForPick(201, this.rightHolder);
        this.rightHolder.display();
        this.scene.popMatrix();
        
        // Goblin holder
        this.scene.pushMatrix();
        this.scene.translate(-1, 0, 5);
        this.scene.scale(2, 1, 2);
        this.scene.rotate(45*DEGREE_TO_RAD, 0, 1, 0);
        this.orc.apply();
        this.scene.registerForPick(202, this.leftHolder);
        this.leftHolder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.registerForPick(203, this.skull);
        this.skull.display();
        this.scene.popMatrix();

    }


    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}