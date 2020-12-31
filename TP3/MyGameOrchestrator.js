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
            PLAYING_AGAIN: 9,
            AWAITING_ZOMBIE_PIECE: 10,
            AWAITING_ZOMBIE_TILE: 11,
            PLAYING_AGAIN_ZOMBIE: 12
        };
        
        //this.currentState = this.gameStates.AWAITING_PIECE;
        this.currentState = null;

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
        this.greenSkull = "g";
        this.scores = [0,0,0];

        this.server = new MyServer(scene);
        this.board = new MyGameBoard(scene);
        this.gameSequence = new MyGameSequence(scene);
        this.responseMenu = new MyMenu(scene);

        //this.state = new AwaitPieceState(scene);

        this.initPrologBoard();
        this.startGame();

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
        //this.currentState =this.gameStates.START;
        this.currentState = new OrcPieceState(this.scene);

    }

    /*

    changeState(state){
        this.state = state;
    }


    async onObjectSelected(obj, id) {
        if (obj instanceof MyChecker){
            console.log("--------------------------");
            console.log("Current State: " + this.currentState);
            console.log("Player: " + this.player);
            console.log("Green skull: " + this.greenSkull);
            console.log("Checker id: " + obj.tileID);
            console.log("Current piece: ");
            console.log(this.currentPiece);
            console.log("List eat moves: ");
            console.log(this.eatMoves);
            console.log("----------------------------");
            if (obj.player == this.player){   
                if (this.currentState == this.gameStates.AWAITING_PIECE || this.currentState == this.gameStates.AWAITING_TILE){ //Awaiting tile too in can player selected wrong piece
                    this.currentPiece = obj;

                    this.currentPieceRow = Math.trunc((this.currentPiece.tileID + 10)/10);
                    this.currentPieceColumn = (this.currentPiece.tileID % 10 + 1);
                    this.startingPoint = [this.currentPieceRow, this.currentPieceColumn];

                    if (obj.currentState == obj.checkerStates.NOT_SELECTED){
                        obj.currentState = obj.checkerStates.SELECTED;
                    } else if (obj.currentState == obj.checkerStates.SELECTED){
                        obj.currentState = obj.checkerStates.NOT_SELECTED;
                    }

                    this.currentState = this.gameStates.AWAITING_TILE;
                    //console.log("SWITCHED STATE: AWAITING TILE - 97");
                }
            }

            if (obj.player == "z"){
                if (this.currentState == this.gameStates.AWAITING_ZOMBIE_PIECE || this.currentState == this.gameStates.AWAITING_ZOMBIE_TILE) {
                    this.currentPiece = obj;

                    this.currentPieceRow = Math.trunc((this.currentPiece.tileID + 10)/10);
                    this.currentPieceColumn = (this.currentPiece.tileID % 10 + 1);
                    this.startingPoint = [this.currentPieceRow, this.currentPieceColumn];

                    if (obj.currentState == obj.checkerStates.NOT_SELECTED){
                        obj.currentState = obj.checkerStates.SELECTED;
                    } else if (obj.currentState == obj.checkerStates.SELECTED){
                        obj.currentState = obj.checkerStates.NOT_SELECTED;
                    }

                    this.currentState = this.gameStates.AWAITING_ZOMBIE_TILE;
                    //console.log("SWITCHED STATE: AWAITING ZOMBIE TILE - 116");
                }
            }
        }
        if (obj instanceof MyTile){
            console.log("--------------------------");
            console.log("Current State: " + this.currentState);
            console.log("Player: " + this.player);
            console.log("Green skull: " + this.greenSkull);
            console.log("Tile id: " + obj.id);
            console.log("Current piece: ");
            console.log(this.currentPiece);
            console.log("List eat moves: ");
            console.log(this.eatMoves);
            console.log("----------------------------");

            if (this.currentState == this.gameStates.AWAITING_TILE){
                console.log("AWAITING TILE");

                let orchestrator = this;

                this.tileRow = Math.trunc((obj.id + 10)/10);
                this.tileColumn = (obj.id % 10 + 1);
                let destination = [this.tileRow, this.tileColumn];

                //move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull)
                let command = "move(" +  this.prologBoard + "-" + "[0,0,0]" + "-" + this.player + "-" + this.greenSkull + "," 
                    + this.currentPieceRow.toString() + "-" + this.currentPieceColumn.toString() + "-" + this.tileRow + "-" + this.tileColumn + "-" + "MoveType" + "," 
                    + "NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull)";
                await this.server.makeRequest(command, function(data) {
                    if (data.target.response != 0){
                        orchestrator.moveParser(data.target.response);
                        orchestrator.move(obj, destination);
                        orchestrator.moveZombies();
                        //orchestrator.switchPlayer(orchestrator.player);
                        //orchestrator.currentState = orchestrator.gameStates.AWAITING_PIECE; //SHOULD BE MOVING PIECE
                    }
                });

            }


            if (this.currentState == this.gameStates.PLAYING_AGAIN){
                console.log("PLAYING AGAIN");

                this.tileRow = Math.trunc((obj.id + 10)/10);
                this.tileColumn = (obj.id % 10 + 1);
                let destination = [this.tileRow, this.tileColumn];

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
    
                    /*
                    //get_move_eat(RowInput, ColumnInput, NewListEat, NewGameState),
                    command = "get_move_eat(" + this.tileRow + "," + this.tileColumn + "," + "NewListEat," + this.prologBoard + ")";
                    await this.server.makeRequest(command, function(data) {
                        orchestrator.eatMoves = JSON.parse(data.target.response);
                        orchestrator.move(obj, destination);
                    });

                }

            }


            if (this.currentState == this.gameStates.AWAITING_ZOMBIE_TILE) {
                console.log("AWAITING_ZOMBIE_TILE");
                let orchestrator = this;

                this.tileRow = Math.trunc((obj.id + 10)/10);
                this.tileColumn = (obj.id % 10 + 1);
                let destination = [this.tileRow, this.tileColumn];
    
                //zombie_move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, Response).
                let command = "zombie_move(" + this.prologBoard + "-" + JSON.stringify([0,0,0]) + "-" + this.player + "-" + this.greenSkull + "," 
                    + this.currentPieceRow + "-" + this.currentPieceColumn + "-" + this.tileRow + "-" + this.tileColumn + "-MoveType" 
                    + ",NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull,y)";
                await this.server.makeRequest(command, function(data) {
                    //console.log("Something's happening..." + data.target.response);
                    orchestrator.zombieMoveParser(data.target.response);
                    orchestrator.move(obj, destination);
                });


                if (this.currentState == this.gameStates.PLAYING_AGAIN_ZOMBIE){
                    console.log("PLAYING AGAIN ZOMBIE");
                    this.tileRow = Math.trunc((obj.id + 10)/10);
                    this.tileColumn = (obj.id % 10 + 1);
                    let destination = [this.tileRow, this.tileColumn];
                    
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
        
                        /*
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


    switchPlayer(player){
        if (player == "o") this.player = "g";
        else if (player == "g") this.player = "o";
    }

    switchGreenSkull(greenSkull){
        if (greenSkull == "o") this.greenSkull = "g";
        else if (greenSkull == "g") this.greenSkull = "o";
    }


    
    move(tile, destination){
        if (this.movementType == "a"){

            if (this.currentState == this.gameStates.AWAITING_TILE){
                this.board.movePiece(this.currentPiece, tile);
                let newMove = new MyGameMove(this.scene, this.currentPiece, this.startingPoint[0], this.startingPoint[1], destination[0], destination[1]);
                this.gameSequence.addGameMove(newMove);
                this.currentPiece.currentState = this.currentPiece.checkerStates.NOT_SELECTED;
                this.currentState = this.gameStates.AWAITING_PIECE;
            }

            if (this.currentState == this.gameStates.AWAITING_ZOMBIE_TILE){
                this.board.movePiece(this.currentPiece, tile);
                let newMove = new MyGameMove(this.scene, this.currentPiece, this.startingPoint[0], this.startingPoint[1], destination[0], destination[1]);
                this.gameSequence.addGameMove(newMove);
                this.switchPlayer(this.player);
                this.currentPiece.currentState = this.currentPiece.checkerStates.NOT_SELECTED;
                this.currentState = this.gameStates.AWAITING_PIECE;
                
            }

        }
        else if (this.movementType == "e"){

            if (this.currentState != this.gameStates.PLAYING_AGAIN && this.currentState != this.gameStates.PLAYING_AGAIN_ZOMBIE){
                this.switchGreenSkull(this.greenSkull);
            }

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

            /*

        }
    }


    playAgain(){
        if (this.currentState == this.gameStates.AWAITING_TILE){
            if (this.eatMoves != this.eatMoves.length > 0 && Array.isArray(this.eatMoves)){ //TO DO: && INPUT DO USER
                this.currentState = this.gameStates.PLAYING_AGAIN;
                //console.log("SWITCHED STATE: PLAY AGAIN - 328");
        
            }
            else if (this.eatMoves.length == 0 && Array.isArray(this.eatMoves)) {
    
                this.currentState = this.gameStates.AWAITING_PIECE;
                //console.log("SWITCHED STATE: AWAITING PIECE - 334");
                this.switchPlayer();
                console.log("SWITCHED PLAYER - 361");
                this.currentPiece.currentState = this.currentPiece.checkerStates.NOT_SELECTED;
                //console.log("NEXT PLAYER");
            }
        }

        if (this.currentState == this.gameStates.AWAITING_ZOMBIE_TILE){
            if (this.eatMoves != this.eatMoves.length > 0 && Array.isArray(this.eatMoves)){ //TO DO: && INPUT DO USER
                this.currentState = this.gameStates.PLAYING_AGAIN_ZOMBIE;
                //console.log("SWITCHED STATE: PLAYING AGAIN ZOMBIE - 343");
        
            }
            else if (this.eatMoves.length == 0 && Array.isArray(this.eatMoves)) {
    
                this.currentState = this.gameStates.AWAITING_PIECE;
                //console.log("SWITCHED STATE: AWAITING PIECE - 349");
                this.switchPlayer();
                console.log("SWITCHED PLAYER - 378");
                this.currentPiece.currentState = this.currentPiece.checkerStates.NOT_SELECTED;
                //console.log("NEXT PLAYER");
            }
        } 
    }


    moveZombies(){
        if (this.player == this.greenSkull){
            this.currentState = this.gameStates.AWAITING_ZOMBIE_TILE;
            //console.log("TURNED STATE INTO AWAITING TILE ZOMBIE STATE");
            //console.log("SWITCHED STATE: AWAITING ZOMBIE TILE - 362");



        }
        else {
            this.switchPlayer(this.player);
            console.log("SWITCHED PLAYER - 397");
        }

    }


    
    moveParser(data){
        let returnedData = data.split("-");
        this.prologBoard = returnedData[0];
        this.eatMoves = JSON.parse(returnedData[1]);
        this.movementType = returnedData[2];
        this.greenSkull = returnedData[3];
    }


    zombieMoveParser(data){
        let returnedData = data.split("-");
        this.prologBoard = returnedData[0];
        this.eatMoves = JSON.parse(returnedData[1]);
        this.movementType = returnedData[2];
        this.greenSkull = returnedData[3];
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