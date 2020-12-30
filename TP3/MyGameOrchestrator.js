class MyGameOrchestrator extends CGFobject {
    /**
     * Constructor of the class MyGameOrchestrator.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);

        
        this.gameStates = {
            START: 0,
            AWAITING_PIECE: 1,
            AWAITING_TILE: 2,
            MOVING_PIECE: 3,
            MOVIE: 4,
            UNDO: 5,
            GAME_OVER: 6,
            WAITING: 7,
            ANIMATION: 8,
            PLAYING_AGAIN: 9
        };
        
        this.currentState = this.gameStates.AWAITING_PIECE;
        
        this.prologBoard = [];
        this.player = "o";
        this.currentPiece = null;
        this.currentPieceRow = null;
        this.currentPieceColumn = null;
        this.tileRow = null;
        this.tileColumn = null;
        this.possibleMoves = [];
        this.adjacentMoves = [];
        this.eatMoves = [];
        this.movementType = "";
        this.startingPoint = [];
        this.elemEaten = null;
        this.elemEatenRow = null;
        this.elemEatenColumn = null;

        this.server = new MyServer(scene);
        this.board = new MyGameBoard(scene);
        this.gameSequence = new MyGameSequence(scene);
        this.responseMenu = new MyMenu(scene);

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


    async onObjectSelected(obj, id) {
        console.log("MOVES: ");
        console.log(this.gameSequence.moves);
        if (obj instanceof MyChecker){
            console.log(this.player);
            if (obj.player == this.player){   
                if (this.currentState == this.gameStates.AWAITING_PIECE || this.currentState == this.gameStates.AWAITING_TILE){ //Awaiting tile too in can player selected wrong piece
                    this.currentPiece = obj;

                    this.currentPieceRow = Math.trunc((this.currentPiece.tileID + 10)/10);
                    this.currentPieceColumn = (this.currentPiece.tileID % 10 + 1);
                    this.startingPoint = [this.currentPieceRow, this.currentPieceColumn];
                    obj.currentState = obj.checkerStates.SELECTED;

                    this.currentState = this.gameStates.AWAITING_TILE;
                }
            }
        }
        if (obj instanceof MyTile){
            console.log("Tile id: " + obj.id);
            console.log("Current State: " + this.currentState);
            if (this.currentState == this.gameStates.AWAITING_TILE){

                this.tileRow = Math.trunc((obj.id + 10)/10);
                this.tileColumn = (obj.id % 10 + 1);
                let destination = [this.tileRow, this.tileColumn];

                //move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull)
                let command = "move(" +  this.prologBoard + "-" + "[0,0,0]" + "-" + this.player + "-" + "o" + "," 
                    + this.currentPieceRow.toString() + "-" + this.currentPieceColumn.toString() + "-" + this.tileRow + "-" + this.tileColumn + "-" + "MoveType" + "," 
                    + "NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull)";
                let orchestrator = this;

                console.log(command);

                await this.server.makeRequest(command, function(data) {
                    console.log(data.target.response);
                    if (data.target.response != 0){
                        orchestrator.moveParser(data.target.response);
                        orchestrator.move(obj, destination);
                        orchestrator.switchPlayer(orchestrator.player);
                        //orchestrator.currentState = orchestrator.gameStates.AWAITING_PIECE; //SHOULD BE MOVING PIECE
                    }
                });

            }

            if (this.currentState == this.gameStates.PLAYING_AGAIN){
                console.log("PLAYING AGAIN");

                this.tileRow = Math.trunc((obj.id + 10)/10);
                this.tileColumn = (obj.id % 10 + 1);
                let destination = [this.tileRow, this.tileColumn];

                console.log("destination is: " + destination);
                console.log("This eatMoves:");
                console.log(this.eatMoves);


                if (this.eatMoves.findIndex(dest => dest[0] == this.tileRow && this.tileColumn) != -1){


                    let orchestrator = this;

                    //change_board(GameState, Row-Column, RowInput-ColumnInput, NewGameState, ElemEaten),
                    let command = "change_board(" + this.prologBoard + "," + this.currentPieceRow + "-" + this.currentPieceColumn + "," + this.tileRow + "-" + this.tileColumn + ",NewGameState,ElemEaten)";
                    await this.server.makeRequest(command, function(data) {
                        let returnData = data.target.response.split("-");
                        orchestrator.prologBoard = returnData[0];
                        orchestrator.elemEaten = returnData[1];
                        orchestrator.elemEatenRow = Math.ceil((orchestrator.tileRow-orchestrator.currentPieceRow)/2) + orchestrator.currentPieceRow;
                        orchestrator.elemEatenColumn = Math.ceil((orchestrator.tileColumn-orchestrator.currentPieceColumn)/2) + orchestrator.currentPieceColumn;
                    });


    
                    /*
                    //change_score([PO,PG,PZ]-Player-ElemEaten,[PO1,PG1,PZ1]),
                    command = "(" + [0,0,0] + "-" + this.player + "-" + ;
                    await this.server.makeRequest(command, function(data) {
                        console.log("Change board response: " + data.target.response);
                        this.prologBoard = data.target.response;
                    });
                    */
    
                    //get_move_eat(RowInput, ColumnInput, NewListEat, NewGameState),
                    command = "get_move_eat(" + this.tileRow + "," + this.tileColumn + "," + "NewListEat," + this.prologBoard + ")";
                    await this.server.makeRequest(command, function(data) {
                        orchestrator.eatMoves = JSON.parse(data.target.response);
                        orchestrator.move(obj, destination);
                    });

                }



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


    
    move(tile, destination){
        if (this.movementType == "a"){

            this.board.movePiece(this.currentPiece, tile);
            let newMove = new MyGameMove(this.scene, this.currentPiece, this.startingPoint[0], this.startingPoint[1], destination[0], destination[1]);
            this.gameSequence.addGameMove(newMove);
            this.currentPiece.currentState = this.currentPiece.checkerStates.NOT_SELECTED;

        }
        else if (this.movementType == "e"){


            this.board.movePiece(this.currentPiece, tile);
            let newMove = new MyGameMove(this.scene, this.currentPiece, this.startingPoint[0], this.startingPoint[1], destination[0], destination[1]);
            newMove.eatenPiece = this.elemEaten;
            newMove.eatenRow = this.elemEatenRow;
            newMove.eatenColumn = this.elemEatenColumn;
            this.gameSequence.addGameMove(newMove);

            this.currentPieceRow = this.tileRow;
            this.currentPieceColumn = this.tileColumn;

            this.playAgain();


            /*
            this.responseMenu.flag = true;

            if (this.value == true){
                if (this.eatMoves != [])
                    this.playAgain();
            }
            */


        }
    }


    playAgain(){
        if (this.eatMoves != this.eatMoves.length > 0 && Array.isArray(this.eatMoves)){ //TO DO: && INPUT DO USER
            this.currentState = this.gameStates.PLAYING_AGAIN;
            console.log("PLAY AGAIN");
    
        }
        else if (this.eatMoves.length == 0 && Array.isArray(this.eatMoves)) {

            this.currentState = this.gameStates.AWAITING_PIECE;
            this.switchPlayer();
            this.currentPiece.currentState = this.currentPiece.checkerStates.NOT_SELECTED;
            console.log("NEXT PLAYER");
        }
    }


    
    moveParser(data){
        let returnedData = data.split("-");
        this.prologBoard = returnedData[0];
        this.eatMoves = JSON.parse(returnedData[1]);
        this.movementType = returnedData[2];
    }


/*
    getParsedMoveList(moveList){
        let allMovesList = moveList.split("-");
        let adjacentMoves = JSON.parse(allMovesList[0]);
        let eatMoves = JSON.parse(allMovesList[1]);

        console.log([adjacentMoves, eatMoves]);

        return [adjacentMoves, eatMoves];
    }
    */


}