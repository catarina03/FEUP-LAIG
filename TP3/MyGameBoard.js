/**
 * MyGameBoard
 */
class MyGameBoard extends CGFobject{
    constructor(scene){
        super(scene);
        this.boardCells = [];
        this.aux = [];
        this.checkers = [];

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

        //let checker1 = new MyChecker(this.scene, "purpleOrc", "orc", tileID, 9.3, 0.5);
        //this.checkers.push(checker1);
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

    //let t = performance.now()*0.001-0.6;
    let t = 0;


    let keyframe0 = new MyKeyframe(t, [vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);

    let keyframe1 = new MyKeyframe(t + 0.25, [vec3.fromValues(deltaX/4, Math.sin(45*DEGREE_TO_RAD), deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);

    let keyframe2 = new MyKeyframe(t + 0.5, [vec3.fromValues(deltaX/2, Math.sin(90*DEGREE_TO_RAD), deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);

    let keyframe3 = new MyKeyframe(t + 0.75, [vec3.fromValues(3*deltaX/4, Math.sin(45*DEGREE_TO_RAD), 3*deltaZ/4), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);

    let keyframe4 = new MyKeyframe(t + 1, [vec3.fromValues(deltaX, Math.sin(0*DEGREE_TO_RAD), deltaZ), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0)]);

    let keyframes = [keyframe0, keyframe1, keyframe2, keyframe3, keyframe4];

    let keyframeAnim = new MyKeyframeAnimation(this.scene, "movementAnimation");
    keyframeAnim.keyframes = keyframes;

    //console.log(keyframeAnim);

    piece.animation = keyframeAnim;
    
}


updatePiece(piece, tile){
    let row = Math.trunc((tile.id + 10)/10);
    let column = (tile.id % 10 + 1);
    let destination = [row, column];

    piece.tileID = tile.id;//(destination[0]-1)*10 + destination[1]-1;
    //piece.xCoord = tile.xCoord;
    //piece.zCoord = tile.zCoord;
    //piece.yCoord = 0.1;

    console.log("PIECE ID AFTER CHANGE: " + piece.tileID);
    return 0;
}


    async movePiece(piece, newTile){
        /*
        console.log("Piece before move");
        console.log(piece.xCoord);
        console.log(piece.zCoord);

        piece.xCoord = newTile.xCoord;
        piece.zCoord = newTile.zCoord;

        console.log("Piece after move");
        console.log(piece.xCoord);
        console.log(piece.zCoord);
        */

        await this.movePieceAnimation(piece, newTile);
        this.sleep(1500);
        this.updatePiece(piece, newTile);
        


        //this.updatePiece(piece, newTile).then()       

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
            this.checkers[checker].display();
            counter++;
        }

        this.scene.popMatrix();

    }


    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}