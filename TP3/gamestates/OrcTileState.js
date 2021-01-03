/**
 * OrcTileState
 */
class OrcTileState extends MyGameState{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     */
    constructor(scene) {
        super(scene);
        this.prologBoardCopy = null;
        this.previousTile = this.getTile(scene.orchestrator.currentPiece);

    };

    async onObjectSelected(obj, id) {
        console.log("ORC TILE STATE, WHATS THE GREEN SKULL?");
        console.log(this.scene.orchestrator.greenSkull);

        if (obj instanceof MyTile){
            let state = this;

            this.scene.orchestrator.currentTile = obj;
            this.scene.orchestrator.tileRow = Math.trunc((obj.id + 10)/10);
            this.scene.orchestrator.tileColumn = (obj.id % 10 + 1);
            let destination = [this.scene.orchestrator.tileRow, this.scene.orchestrator.tileColumn];

            //move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull)
            let command = "move(" +  this.scene.orchestrator.prologBoard + "-" + JSON.stringify(this.scene.orchestrator.scores) + "-" + this.scene.orchestrator.player + "-" + this.scene.orchestrator.greenSkull + "," 
                + this.scene.orchestrator.currentPieceRow.toString() + "-" + this.scene.orchestrator.currentPieceColumn.toString() + "-" + this.scene.orchestrator.tileRow + "-" + this.scene.orchestrator.tileColumn + "-" + "MoveType" + "," 
                + "NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull)";
            await this.scene.orchestrator.server.makeRequest(command, function(data) {
                if (data.target.response != 0){
                    state.moveParser(data.target.response);
                    state.move(obj, destination);
                }
            });

        }
        
    }


    // MoveType-NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull
    moveParser(data){
        this.prologBoardCopy = this.scene.orchestrator.prologBoard;

        let returnedData = data.split("-");
        this.scene.orchestrator.movementType = returnedData[0];
        this.scene.orchestrator.prologBoard = returnedData[1];
        this.scene.orchestrator.scores = JSON.parse(returnedData[2]);
        this.scene.orchestrator.eatMoves = JSON.parse(returnedData[3]);

        console.log("Moving green skull");

        if (this.scene.orchestrator.greenSkull != returnedData[4]) {
            this.scene.orchestrator.board.moveGreenSkull(returnedData[4]);
        }

        console.log("Moved green skull");

        this.scene.orchestrator.greenSkull = returnedData[4];
    }


    getEatenElement(elementId) {
        for (let checker in this.scene.orchestrator.board.checkers) {
            if (this.scene.orchestrator.board.checkers[checker].tileID == elementId) {
                return this.scene.orchestrator.board.checkers[checker];
            }
        }

        return null;
    }


    
    getTile(id) {
        //console.log(id);
        //console.log(this.scene.orchestrator.board.boardCells);

        for (let i = 0; i < 10; i++){
            for (let j = 0; j <= i; j++){
                //console.log(this.scene.orchestrator.board.boardCells[i][j]);
                if (this.scene.orchestrator.board.boardCells[i][j].id == id){
                    //console.log(this.scene.orchestrator.board.boardCells[i][j]);
                    return this.scene.orchestrator.board.boardCells[i][j].id
                }
            }
        }
        
        return null;
    }
    

    managePick(pickMode, pickResults){
        if (pickMode == false) {
			if (pickResults != null && pickResults.length > 0) {
				for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
					if (obj) {
                        var customId = pickResults[i][1];
                        //console.log("Picked object: " + obj + ", with pick id " + customId);
						this.onObjectSelected(obj, customId);					
					}
				}
				pickResults.splice(0, pickResults.length);
			}
        }
    }


    move(tile, destination){
        if (this.scene.orchestrator.movementType == "a"){
            this.scene.orchestrator.board.movePiece(this.scene.orchestrator.currentPiece, tile);

            let newMove = new MyGameMove(this.scene, this.scene.orchestrator.currentPiece, this.scene.orchestrator.startingPoint[0], this.scene.orchestrator.startingPoint[1], destination[0], destination[1]);
            newMove.tile = this.previousTile;
            this.scene.orchestrator.gameSequence.addGameMove(newMove);

            this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;

            if (this.scene.orchestrator.greenSkull == "o"){
                console.log("Goblin state 1");
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new ZombiePieceState(this.scene), new GoblinPieceState(this.scene));
            } else if (this.scene.orchestrator.greenSkull == "g"){
                console.log("Goblin state 2");
                this.scene.orchestrator.player = "g";
                this.scene.orchestrator.currentState = new GoblinPieceState(this.scene);
            }
        }
        else if (this.scene.orchestrator.movementType == "e"){

            this.scene.orchestrator.elemEatenRow = Math.ceil((this.scene.orchestrator.tileRow - this.scene.orchestrator.currentPieceRow)/2) + this.scene.orchestrator.currentPieceRow;
            this.scene.orchestrator.elemEatenColumn = Math.ceil((this.scene.orchestrator.tileColumn - this.scene.orchestrator.currentPieceColumn)/2) + this.scene.orchestrator.currentPieceColumn;
            let eatenId = (this.scene.orchestrator.elemEatenRow - 1) * 10 + (this.scene.orchestrator.elemEatenColumn - 1);
            this.scene.orchestrator.elemEaten = this.getEatenElement(eatenId);
            this.scene.orchestrator.elemEatenPlayer = this.scene.orchestrator.elemEaten.player;

            console.log("ORC TILE STATE, WHATS THE GREEN SKULL?");
            console.log(this.scene.orchestrator.greenSkull);
            //if (this.scene.orchestrator.greenSkull == "o"){
            //    console.log("Move green skull");
            //    this.scene.orchestrator.board.moveGreenSkull(this.scene.orchestrator.greenSkull);
            //    console.log("Animated green skull");
            //    this.switchGreenSkull(this.scene.orchestrator.greenSkull);
            //}

            this.scene.orchestrator.board.movePiece(this.scene.orchestrator.currentPiece, tile);
            let newMove = new MyGameMove(this.scene, this.scene.orchestrator.currentPiece, this.scene.orchestrator.startingPoint[0], this.scene.orchestrator.startingPoint[1], destination[0], destination[1]);
            newMove.eatenPiece = this.scene.orchestrator.elemEaten;
            newMove.eatenRow = this.scene.orchestrator.elemEatenRow;
            newMove.eatenColumn = this.scene.orchestrator.elemEatenColumn;
            newMove.tile = this.previousTile;
            this.scene.orchestrator.gameSequence.addGameMove(newMove);
            
            this.scene.orchestrator.auxiliarBoard.eatPiece(this.scene.orchestrator.elemEaten);

            this.scene.orchestrator.currentPieceRow = this.scene.orchestrator.tileRow;
            this.scene.orchestrator.currentPieceColumn = this.scene.orchestrator.tileColumn;

            if (this.scene.orchestrator.eatMoves.length == 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.greenSkull == "o") {
                console.log("Goblin state 1");
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new ZombiePieceState(this.scene), new GoblinPieceState(this.scene));
                this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
            }
            else if (this.scene.orchestrator.eatMoves.length == 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.greenSkull == "g") {
                console.log("Goblin state 2");
                this.scene.orchestrator.player = "g";
                this.scene.orchestrator.currentState = new GoblinPieceState(this.scene);
                this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
            }
            else if (this.scene.orchestrator.eatMoves.length > 0 && Array.isArray(this.scene.orchestrator.eatMoves)) {
                console.log("Goblin state 3");
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new OrcPlayAgainState(this.scene), new GoblinPieceState(this.scene));
            }
        }
    }


}