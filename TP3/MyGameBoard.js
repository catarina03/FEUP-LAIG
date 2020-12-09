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

        let checker1 = new MyChecker(this.scene,  "purpleOrc", "orc");
        this.checkers.push(checker1);
    }


    display(){

        this.scene.pushMatrix();
        
        this.scene.translate(1, 0, 1);
        this.scene.rotate(-45*DEGREE_TO_RAD, 0, 1, 0);
        this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);
        

        for (let i = 0; i < this.boardCells.length; i++) {

            for (let j = 0; j < this.boardCells[i].length; j++) {
                this.scene.registerForPick(i*10 + j, this.boardCells[i][j]);
                this.boardCells[i][j].display();
                
            }

        }

        this.scene.popMatrix();

        this.scene.pushMatrix();

        for(let i = 0; i < this.checkers.length; i++){
            this.scene.registerForPick(99 + i+1, this.checkers[i]);
            this.checkers[i].display();
        }

        this.scene.popMatrix();

    }
}