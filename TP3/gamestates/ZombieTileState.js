/**
 * ZombieTileState
 */
class ZombieTileState extends MyGameState{
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

            //zombie_move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, Response).
            let command = "zombie_move(" + this.scene.orchestrator.prologBoard + "-" + JSON.stringify([0,0,0]) + "-" + this.scene.orchestrator.player + "-" + this.scene.orchestrator.greenSkull + "," 
                + this.scene.orchestrator.currentPieceRow + "-" + this.scene.orchestrator.currentPieceColumn + "-" + this.scene.orchestrator.tileRow + "-" + this.scene.orchestrator.tileColumn + "-MoveType" 
                + ",NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull,y)";
            await this.scene.orchestrator.server.makeRequest(command, function(data) {
                //console.log("Something's happening..." + data.target.response);
                state.zombieMoveParser(data.target.response);
                state.move(obj, destination);
            });

        }
        
    }


    // MoveType-NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull
    zombieMoveParser(data){
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


    switchGreenSkull(greenSkull){
        if (greenSkull == "o") this.greenSkull = "g";
        else if (greenSkull == "g") this.greenSkull = "o";
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

            if (this.scene.orchestrator.player == "o"){
                this.scene.orchestrator.player = "g";
                this.scene.orchestrator.currentState = new GoblinPieceState(this.scene);
            } else if (this.scene.orchestrator.player == "g"){
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

            this.switchGreenSkull(this.scene.orchestrator.greenSkull);

            this.scene.orchestrator.board.movePiece(this.scene.orchestrator.currentPiece, tile);

            let newMove = new MyGameMove(this.scene, this.scene.orchestrator.currentPiece, this.scene.orchestrator.startingPoint[0], this.scene.orchestrator.startingPoint[1], destination[0], destination[1]);
            newMove.eatenPiece = this.scene.orchestrator.elemEaten;
            newMove.eatenRow = this.scene.orchestrator.elemEatenRow;
            newMove.eatenColumn = this.scene.orchestrator.elemEatenColumn;
            this.scene.orchestrator.gameSequence.addGameMove(newMove);

            this.scene.orchestrator.auxiliarBoard.eatPiece(this.scene.orchestrator.elemEaten);

            this.scene.orchestrator.currentPieceRow = this.scene.orchestrator.tileRow;
            this.scene.orchestrator.currentPieceColumn = this.scene.orchestrator.tileColumn;

            if (this.scene.orchestrator.eatMoves.length == 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.player == "o") {
                this.scene.orchestrator.player = "g";
                this.scene.orchestrator.currentState = new GoblinPieceState(this.scene);
                this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
            }
            else if (this.scene.orchestrator.eatMoves.length == 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.player == "g") {
                this.scene.orchestrator.player = "o";
                this.scene.orchestrator.currentState = new OrcPieceState(this.scene);
                this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
            }
            else if (this.scene.orchestrator.eatMoves.length > 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.player == "o") {
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new ZombiePlayAgainState(this.scene), new GoblinPieceState(this.scene));
            }
            else if (this.scene.orchestrator.eatMoves.length > 0 && Array.isArray(this.scene.orchestrator.eatMoves) && this.scene.orchestrator.player == "g") {
                this.scene.orchestrator.currentState = new ChoiceState(this.scene, new ZombiePlayAgainState(this.scene), new OrcPieceState(this.scene));
            }
        }
    }


}