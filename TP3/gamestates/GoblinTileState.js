/**
 * GoblinTileState
 */
class GoblinTileState extends MyGameState{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     */
    constructor(scene) {
        super(scene);

    };

    async onObjectSelected(obj, id) {
        if (obj instanceof MyTile){
            let state = this;

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
                    //state.moveZombies();
                    //orchestrator.switchPlayer(orchestrator.player);
                    //orchestrator.currentState = orchestrator.gameStates.AWAITING_PIECE; //SHOULD BE MOVING PIECE
                }
            });

        }
        
    }

    // MoveType-NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull
    moveParser(data){
        let returnedData = data.split("-");
        this.scene.orchestrator.movementType = returnedData[0];
        this.scene.orchestrator.prologBoard = returnedData[1];
        this.scene.orchestrator.scores = JSON.parse(returnedData[2]);
        this.scene.orchestrator.eatMoves = JSON.parse(returnedData[3]);
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
            this.scene.orchestrator.gameSequence.addGameMove(newMove);

            this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;

            if (this.scene.orchestrator.greenSkull == "g"){
                console.log("Goblin choice state");
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new ZombiePieceState(this.scene), new OrcPieceState(this.scene));
            } else if (this.scene.orchestrator.greenSkull == "o"){
                console.log("Goblin orc piece state");
                this.scene.orchestrator.player = "o";
                this.scene.orchestrator.currentState = new OrcPieceState(this.scene);
            }
        }
        else if (this.scene.orchestrator.movementType == "e"){

            this.scene.orchestrator.elemEatenRow = Math.ceil((this.scene.orchestrator.tileRow - this.scene.orchestrator.currentPieceRow)/2) + this.scene.orchestrator.currentPieceRow;
            this.scene.orchestrator.elemEatenColumn = Math.ceil((this.scene.orchestrator.tileColumn - this.scene.orchestrator.currentPieceColumn)/2) + this.scene.orchestrator.currentPieceColumn;
            let eatenId = (this.scene.orchestrator.elemEatenRow - 1) * 10 + (this.scene.orchestrator.elemEatenColumn - 1);
            this.scene.orchestrator.elemEaten = this.getEatenElement(eatenId);
            this.scene.orchestrator.elemEatenPlayer = this.scene.orchestrator.elemEaten.player;

            if (this.scene.orchestrator.greenSkull == "g"){
                this.switchGreenSkull(this.scene.orchestrator.greenSkull);
            }

            this.scene.orchestrator.board.movePiece(this.scene.orchestrator.currentPiece, tile);
            let newMove = new MyGameMove(this.scene, this.scene.orchestrator.currentPiece, this.scene.orchestrator.startingPoint[0], this.scene.orchestrator.startingPoint[1], destination[0], destination[1]);
            newMove.eatenPiece = this.scene.orchestrator.elemEaten;
            newMove.eatenRow = this.scene.orchestrator.elemEatenRow;
            newMove.eatenColumn = this.scene.orchestrator.elemEatenColumn;
            this.scene.orchestrator.gameSequence.addGameMove(newMove);

            this.scene.orchestrator.auxiliarBoard.eatPiece(this.scene.orchestrator.elemEaten);

            this.scene.orchestrator.currentPieceRow = this.scene.orchestrator.tileRow;
            this.scene.orchestrator.currentPieceColumn = this.scene.orchestrator.tileColumn;

            if (this.scene.orchestrator.eatMoves.length == 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.greenSkull == "g") {
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new ZombiePieceState(this.scene), new OrcPieceState(this.scene));
                this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
            }
            else if (this.scene.orchestrator.eatMoves.length == 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.greenSkull == "o") {
                this.scene.orchestrator.player = "o";
                this.scene.orchestrator.currentState = new OrcPieceState(this.scene);
                this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
            }
            else if (this.scene.orchestrator.eatMoves.length > 0 && Array.isArray(this.scene.orchestrator.eatMoves)) {
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new GoblinPlayAgainState(this.scene), new OrcPieceState(this.scene));
            }
        }
    }
    

}