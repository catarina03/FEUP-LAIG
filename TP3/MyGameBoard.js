/**
 * MyGameBoard
 */
class MyGameBoard extends CGFobject{
    constructor(scene){
        super(scene);
        this.boardCells = [];
        this.aux = [];

        this.buildBoard();
    }

    buildBoard(){
        for(let i = 0; i < 10; i++){
            let aux = [];

            for(let j = 0; j <= i; j++){
                
                console.log("Linha: " + i + " Coluna: " + j + " / " + i + j + (i+1) + (j+1)); 
                let cell = new MyRectangle(this.scene, i, j - i/2, i+2/3, j+2/3 - i/2);
                let id = i*10 + j;
                aux[j] = cell;

                
            }
            
            this.boardCells[i] = aux;
        }
    }


    display(){

        this.scene.pushMatrix();

        //this.scene.translate(0, 0, this.boardCells[this.boardCells.length-1].length);
        this.scene.rotate(-45*DEGREE_TO_RAD, 0, 1, 0);
        this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);

        for (let i = 0; i < this.boardCells.length; i++) {

            for (let j = 0; j < this.boardCells[i].length; j++) {
                this.scene.registerForPick(i*10 + j, this.boardCells[i][j]);
                this.boardCells[i][j].display();
                
                /*
                if(this.boardCells[i][j].getPiece() != null){
                    this.boardCells[i][j].getPiece().display();
                }
                */
            }

        }

        this.scene.popMatrix();

    }
}