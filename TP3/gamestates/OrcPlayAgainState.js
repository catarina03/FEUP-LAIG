/**
 * OrcPlayAgainState
 */
class OrcPlayAgainState extends MyGameState{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     */
    constructor(scene) {
        super(scene);

        this.previousTile = this.getTile(scene.orchestrator.currentPiece);

    };

    async onObjectSelected(obj, id) {
        console.log("ORC PLAY AGAIN STATE, WHATS THE GREEN SKULL?");
        console.log(this.scene.orchestrator.greenSkull);

        if (obj instanceof MyTile){
            let state = this;

            this.scene.orchestrator.currentTile = obj;
            this.scene.orchestrator.tileRow = Math.trunc((obj.id + 10)/10);
            this.scene.orchestrator.tileColumn = (obj.id % 10 + 1);
            let destination = [this.scene.orchestrator.tileRow, this.scene.orchestrator.tileColumn];

            if (this.scene.orchestrator.eatMoves.findIndex(dest => dest[0] == this.scene.orchestrator.tileRow && dest[1] == this.scene.orchestrator.tileColumn) != -1){
                let orchestrator = this.scene.orchestrator;

                //change_board(GameState, Row-Column, RowInput-ColumnInput, NewGameState, ElemEaten),
                let command = "change_board(" + this.scene.orchestrator.prologBoard + "," 
                    + this.scene.orchestrator.currentPieceRow + "-" + this.scene.orchestrator.currentPieceColumn + "," 
                    + this.scene.orchestrator.tileRow + "-" + this.scene.orchestrator.tileColumn 
                    + ",NewGameState,ElemEaten)";
                await this.scene.orchestrator.server.makeRequest(command, function(data) {
                    let returnData = data.target.response.split("-");
                    orchestrator.prologBoard = returnData[0];
                    orchestrator.elemEatenPlayer = returnData[1];
                    orchestrator.elemEatenRow = Math.ceil((orchestrator.tileRow-orchestrator.currentPieceRow)/2) + orchestrator.currentPieceRow;
                    orchestrator.elemEatenColumn = Math.ceil((orchestrator.tileColumn-orchestrator.currentPieceColumn)/2) + orchestrator.currentPieceColumn;
                });

                //change_score([PO,PG,PZ]-Player-ElemEaten,[PO1,PG1,PZ1]),
                command = "change_score(" + JSON.stringify(this.scene.orchestrator.scores) + "-" + this.scene.orchestrator.player + "-" + this.scene.orchestrator.elemEatenPlayer + "," 
                    + "[PO1,PG1,PZ1])";
                await this.scene.orchestrator.server.makeRequest(command, function(data) {
                    orchestrator.scores = JSON.parse(data.target.response);
                });

                //get_move_eat(RowInput, ColumnInput, NewListEat, NewGameState),
                command = "get_move_eat(" + this.scene.orchestrator.tileRow + "," + this.scene.orchestrator.tileColumn + "," + "NewListEat," + this.scene.orchestrator.prologBoard + ")";
                await this.scene.orchestrator.server.makeRequest(command, function(data) {
                    orchestrator.eatMoves = JSON.parse(data.target.response);
                    state.move(obj, destination);
                });
            }

        }
        
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
        if (this.scene.orchestrator.movementType == "e"){

            let eatenId = (this.scene.orchestrator.elemEatenRow - 1) * 10 + (this.scene.orchestrator.elemEatenColumn - 1);
            this.scene.orchestrator.elemEaten = this.getEatenElement(eatenId);
            this.scene.orchestrator.elemEatenPlayer = this.scene.orchestrator.elemEaten.player;

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

            console.log("OrcPlayAgain eatMoves: ");
            console.log(this.scene.orchestrator.eatMoves);

            if (this.scene.orchestrator.eatMoves.length == 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.greenSkull == "o") {
                console.log("Zombie piece state");
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new ZombiePieceState(this.scene), new GoblinPieceState(this.scene));
                this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
            }
            else if (this.scene.orchestrator.eatMoves.length == 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.greenSkull == "g") {
                console.log("Goblin piece state");
                this.scene.orchestrator.player = "g";
                this.scene.orchestrator.currentState = new GoblinPieceState(this.scene);
                this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
            }
            else if (this.scene.orchestrator.eatMoves.length > 0 && Array.isArray(this.scene.orchestrator.eatMoves)) {
                console.log("Orc piece state");
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new OrcPlayAgainState(this.scene), new GoblinPieceState(this.scene));
            }
        }
    }
    

}