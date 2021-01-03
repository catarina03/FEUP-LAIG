/**
 * BotState
 */
class BotState extends CGFObject{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     */
    constructor(scene) {
        super(scene);
        this.originTile = null;
        this.destinationTile = null;


    };


    start(){
        //choose_move(GameState, Player,Level,RowPiece-ColumnPiece-Row-Column).
        let command = "choose_move(" +  this.scene.orchestrator.prologBoard + "," + this.scene.orchestrator.player + ",LO,RowPiece-ColumnPiece-Row-Column)";
        await this.scene.orchestrator.server.makeRequest(command, function(data) {
            this.chooseMoveParser(data.target.response);
        });

        //move(GameState-[PO,PG,PZ]-Player-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull).
        let command = "move(" +  this.scene.orchestrator.prologBoard + "-" + JSON.stringify(this.scene.orchestrator.scores) + "-" + this.scene.orchestrator.player + "-" + this.scene.orchestrator.greenSkull + "," +
            this.originTile[0] + "-" + this.originTile[1] + "-" + this.originTile[2] + "-" + this.originTile[3] + "-" + "MoveType,NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull)";
        await this.scene.orchestrator.server.makeRequest(command, function(data) {
            this.moveParser(data.target.response);
        });

        //play_again_bot(NewGameState-[PO1,PG1,PZ1], ListEat, Player-[Row, Column]-MoveType, NewerGameState-[PO2,PG2,PZ2]).
        let command = "play_again_bot(" +  this.scene.orchestrator.prologBoard + "-" + JSON.stringify(this.scene.orchestrator.scores) + "," + 
            this.scene.orchestrator.eatMoves + "," + 
            this.scene.orchestrator.player + "-" + JSON.stringify(this.destinationTile[0]) + "-" + this.movementType + "," + 
            "NewerGameState-[PO2,PG2,PZ2])";
        await this.scene.orchestrator.server.makeRequest(command, function(data) {
            this.playAgainBotParser(data.target.response);
        });

        //play_again_zombies(NewZombieGameState-[PO3,PG3,PZ3]-NewerGreenSkull, ListEatZombie, Player-[RowZombie, ColumnZombie]-MoveTypeZombie, FinalGameState-[POF,PGF,PZF]-NewestGreenSkull).
        
        //is_over(GameState)
        let command = "is_over(" +  this.scene.orchestrator.prologBoard + ")";
        await this.scene.orchestrator.server.makeRequest(command, function(data) {
            if (data.target.response == 0){
                orchestrator.currentState = new GameOverState(scene); 
            }
        });

    }


    chooseMoveParser(data){
        let returnData = data.split("-");
        this.originTile = [returnData[0], returnData[1]];
        this.destinationTile = [returnData[2], returnData[3]];
    }


    // MoveType-NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull
    moveParser(data){
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


    playAgainBotParser(data){
        let returnedData = data.split("-");
        this.scene.orchestrator.prologBoard = returnedData[0];
        this.scene.orchestrator.scores = JSON.parse(returnedData[1]);
    }

    
    async onObjectSelected(obj, id) {
        console.log("ORC PIECE STATE, WHATS THE GREEN SKULL?");
        console.log(this.scene.orchestrator.greenSkull);

        console.log("Scores: ");
        console.log(this.scene.orchestrator.scores);

        let orchestrator = this.scene.orchestrator;
        let scene = this.scene;

        //is_over(GameState)
        let command = "is_over(" +  this.scene.orchestrator.prologBoard + ")";
        await this.scene.orchestrator.server.makeRequest(command, function(data) {
            if (data.target.response == 0){
                orchestrator.currentState = new GameOverState(scene); 
            }
        });

        if (obj instanceof MyChecker && this.scene.orchestrator.player == "o" && obj.player == "o"){
                this.scene.orchestrator.currentPiece = obj;

                this.scene.orchestrator.currentPieceRow = Math.trunc((this.scene.orchestrator.currentPiece.tileID + 10)/10);
                this.scene.orchestrator.currentPieceColumn = (this.scene.orchestrator.currentPiece.tileID % 10 + 1);
                this.scene.orchestrator.startingPoint = [this.scene.orchestrator.currentPieceRow, this.scene.orchestrator.currentPieceColumn];

                if (this.scene.orchestrator.currentPiece.currentState == this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED){
                    this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.SELECTED;
                } else if (this.scene.orchestrator.currentPiece.currentState == this.scene.orchestrator.currentPiece.checkerStates.SELECTED){
                    this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
                }

                this.scene.orchestrator.currentState = new OrcTileState(this.scene);                
            }        
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
    }





}