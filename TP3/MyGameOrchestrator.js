class MyGameOrchestrator extends CGFobject {
    /**
     * Constructor of the class MyGameOrchestrator.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);
        this.scene;

        this.board = null;

        this.gameStates = {
            START: 0,
            START_PLAY: 1,
            MOVING_PIECE: 2,
            MOVIE:3,
            UNDO:4,
            GAME_OVER: 5
        };

        this.currentState = this.gameStates.START_PLAY;

    }

    onObjectSelected(obj, id) {
        if (obj instanceof MyChecker){
            if (this.currentState == this.gameStates.START_PLAY){
                this.currentPiece = obj;
                this.currentState = this.gameStates.MOVING_PIECE;
            }
        }
        if (obj instanceof MyTile){
            if (this.currentState == this.gameStates.MOVING_PIECE){
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