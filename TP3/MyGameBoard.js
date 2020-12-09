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
        for(let i = 6; i < 10; i++){
            //Orcs
            for (let j = 0; j <= i-6; j++){
                let piece = new MyChecker(this.scene, "purpleOrc", "Player", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                this.checkers[i*10+j] = piece;
            }

            //Goblins
            for (let j = 6; j <= i; j++){
                let piece = new MyChecker(this.scene, "whiteOrc", "Player", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                this.checkers[i*10+j] = piece;
            }

        }

        //Zombies
        for(let i = 2; i < 4; i++){
            for(let j = 0; j <= i; j++){
                if (j == 0){
                    let piece = new MyChecker(this.scene, "zombie", "Player", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                    this.checkers[i*10+j] = piece;
                }
                if (j == i){
                    let piece = new MyChecker(this.scene, "zombie", "Player", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                    this.checkers[i*10+j] = piece;
                }
            }
        }
        for(let i = 4; i < 7; i++){
            for(let j = 0; j <= i; j++){
                console.log(i + "/" + j);
                if (this.boardCells[i].length % 2 == 1){
                    let piece = new MyChecker(this.scene, "zombie", "Player", this.boardCells[i][Math.ceil(i/2)].id, this.boardCells[i][Math.ceil(i/2)].xCoord, this.boardCells[i][Math.ceil(i/2)].zCoord);
                    this.checkers[i*10+j] = piece;
                }
                else {
                    if(j == Math.floor(i/2) || j == Math.ceil(i/2)){
                        let piece = new MyChecker(this.scene, "zombie", "Player", this.boardCells[i][j].id, this.boardCells[i][j].xCoord, this.boardCells[i][j].zCoord);
                        this.checkers[i*10+j] = piece;
                    }
                }
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


    display(){

        this.scene.pushMatrix();
        this.scene.rotate(45*DEGREE_TO_RAD, 0, 1, 0);
        //this.scene.rotate(180*DEGREE_TO_RAD, 1, 0, 0);
        

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

        this.scene.pushMatrix();

        //this.scene.rotate(-45*DEGREE_TO_RAD, 0, 1, 0);


        this.scene.popMatrix();

    }
}