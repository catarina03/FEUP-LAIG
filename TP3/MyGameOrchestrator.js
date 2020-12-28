class MyGameOrchestrator extends CGFobject {
    /**
     * Constructor of the class MyGameOrchestrator.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);

        this.prologBoard = [];
        this.player = "o";
        this.currentPiece = null;
        this.possibleMoves = [];
        this.movementType = "";
        this.startingPoint = [];

        this.gameStates = {
            START: 0,
            AWAITING_PIECE: 1,
            AWAITING_TILE: 2,
            MOVING_PIECE: 3,
            MOVIE: 4,
            UNDO: 5,
            GAME_OVER: 6,
            WAITING: 7
        };

        this.currentState = this.gameStates.AWAITING_PIECE;
        
        this.server = new MyServer(scene);
        this.board = new MyGameBoard(scene);
        this.gameSequence = new MyGameSequence(scene);

        this.initPrologBoard();
        //this.startGame();

    }

    initPrologBoard(){
        this.prologBoard = "[" +        
                "[e]," +          
                "[e,e]," +          
                "[z,e,z]," +         
                "[z,e,e,z]," +          
                "[e,e,z,e,e]," +          
                "[e,e,z,z,e,e]," +             
                "[g,e,e,z,e,e,o]," +       
                "[g,g,e,e,e,e,o,o]," +        
                "[g,g,g,e,e,e,o,o,o]," +   
                "[g,g,g,g,e,e,o,o,o,o]]";
    }

    startGame(){
        //this.server.makeRequest('start', 'OK');
        this.currentState =this.gameStates.START;

    }


    onObjectSelected(obj, id) {
        console.log("MOVES: ");
        console.log(this.gameSequence.moves);
        if (obj instanceof MyChecker){
            console.log(this.player);
            if (obj.player == this.player){   
                if (this.currentState == this.gameStates.AWAITING_PIECE || this.currentState == this.gameStates.AWAITING_TILE){ //Awaiting tile too in can player selected wrong piece
                    this.currentPiece = obj;

                    let row = Math.trunc((this.currentPiece.tileID + 10)/10);
                    let column = (this.currentPiece.tileID % 10 + 1);
                    this.startingPoint = [row, column];
                    

                    console.log("CURRENT PIECE:")
                    console.log(this.currentPiece);
                    console.log("Starting point: " + this.startingPoint);

                    //valid_moves(GameState, _-Row-Column, ListAdjacentMoves-ListEatMoves)
                    let command = "valid_moves(" + this.prologBoard + ","  + this.player + "-" + Math.trunc((this.currentPiece.tileID + 10)/10).toString() + "-" + (this.currentPiece.tileID % 10 + 1).toString() + "," + "LA-LE" + ")";

                    let moveList;
                    let orchestrator = this;
                    this.server.makeRequest(command, function(data) {
                        console.log(data.target.response);
                        orchestrator.possibleMoves = data.target.response;
                    });

                    this.currentState = this.gameStates.AWAITING_TILE;
                }
            }
        }
        if (obj instanceof MyTile){
            console.log("Tile id: " + obj.id);
            if (this.currentState == this.gameStates.AWAITING_TILE){

                let row = Math.trunc((obj.id + 10)/10);
                let column = (obj.id % 10 + 1);
                let destination = [row, column];

                //is_valid_move(GameState, LAM-LEM, [Row, Column], MoveType);
                let command = "is_valid_move(" + this.prologBoard + ","  + this.possibleMoves + "," + JSON.stringify(destination) + "," + "MoveType)";
                let orchestrator = this;
                console.log(command);

                this.server.makeRequest(command, function(data) {
                    console.log(data.target.response);
                    orchestrator.movementType = data.target.response; 
                    orchestrator.move(orchestrator, obj, destination);
                });
            }
        }
    }
    


    managePick(pickMode, pickResults){
        if (pickMode == false) {
			if (pickResults != null && pickResults.length > 0) {
				for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
					if (obj) {
                        var customId = pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
						this.onObjectSelected(obj, customId);					
					}
				}
				pickResults.splice(0, pickResults.length);
			}
        }
    }


    switchPlayer(player){
        if (player == "o") this.player = "g";
        else if (player == "g") this.player = "o";
    }


    
    move(orchestrator, obj, destination){
        if (this.movementType == "a"){

            this.board.movePiece(this.currentPiece, obj);
            this.switchPlayer(orchestrator.player);
            
            //change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, e);
            let command = "change_board(" + this.prologBoard + ","  + this.startingPoint[0] + "-" + this.startingPoint[1] + "," + + destination[0] + "-" + destination[1] + "," + "NewGameState,e)";
            console.log(command);

            
            this.server.makeRequest(command, function(data) {
                console.log(data.target.response);
                orchestrator.prologBoard = data.target.response; 
                orchestrator.currentState = orchestrator.gameStates.AWAITING_PIECE; //SHOULD BE MOVING PIECE
                //moveList = data.target.response;
            });

            let newMove = new MyGameMove(this.scene, this.currentPiece, this.startingPoint[0], this.startingPoint[1], destination[0], destination[1]);
            this.gameSequence.addGameMove(newMove);
        }
        else if (this.movementType == "e"){
            this.board.movePiece(this.currentPiece, obj);
            this.currentState = this.gameStates.AWAITING_PIECE; //SHOULD BE MOVING PIECE
            orchestrator.switchPlayer(orchestrator.player);
        }
    }


    


    getParsedMoveList(moveList){
        let allMovesList = moveList.split("-");
        let adjacentMoves = JSON.parse(allMovesList[0]);
        let eatMoves = JSON.parse(allMovesList[1]);

        console.log([adjacentMoves, eatMoves]);

        return [adjacentMoves, eatMoves];
    }


}