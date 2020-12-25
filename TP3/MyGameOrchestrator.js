class MyGameOrchestrator extends CGFobject {
    /**
     * Constructor of the class MyGameOrchestrator.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);
        this.scene;

        this.board = null;
        this.prologBoard = null;
        this.player = "o";

        this.gameStates = {
            START: 0,
            START_PLAY: 1,
            MOVING_PIECE: 2,
            MOVIE: 3,
            UNDO: 4,
            GAME_OVER: 5,
            WAITING: 6
        };

        this.currentState = this.gameStates.START_PLAY;

        this.server = new MyServer();

    }

    startGame(){
        this.server.makeRequest('start', 'OK');
        this.currentState =this.gameStates.START_PLAY;

    }

    onObjectSelected(obj, id) {
        if (obj instanceof MyChecker){
            if (this.currentState == this.gameStates.START_PLAY){
                if (obj.player == this.player){   
                    this.currentPiece = obj;
                    this.currentState = this.gameStates.MOVING_PIECE;
                }
            }
        }
        if (obj instanceof MyTile){
            if (this.currentState == this.gameStates.MOVING_PIECE){
                //valid_piece(GameState,o,Row,Column)
                //let command = "valid_piece(" + this.prologBoard + ","  + this.pieceSelected[1].type.toString() + "," + (x + 1).toString() + "," + (y + 1).toString() + ")";

                /*
                this.server.makeRequest(command, function(data) {
                    let response = data.target.response;

                    quantik.makePersonMove(response, x, y);
                });
                */
                //this.server.makeRequest(command, "OK");

                this.board.movePiece(this.currentPiece, obj);
                this.currentState = this.gameStates.START_PLAY;
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


}