/**
 * ZombiePieceState
 */
class ZombiePieceState extends MyGameState{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     */
    constructor(scene) {
        super(scene);

    
    };
    

    async onObjectSelected(obj, id) {
        console.log("Scores: ");
        console.log(this.scene.orchestrator.scores);
        if (obj instanceof MyChecker && obj.player == "z"){
                this.scene.orchestrator.currentPiece = obj;

                this.scene.orchestrator.currentPieceRow = Math.trunc((this.scene.orchestrator.currentPiece.tileID + 10)/10);
                this.scene.orchestrator.currentPieceColumn = (this.scene.orchestrator.currentPiece.tileID % 10 + 1);
                this.scene.orchestrator.startingPoint = [this.scene.orchestrator.currentPieceRow, this.scene.orchestrator.currentPieceColumn];

                if (this.scene.orchestrator.currentPiece.currentState == this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED){
                    this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.SELECTED;
                } else if (this.scene.orchestrator.currentPiece.currentState == this.scene.orchestrator.currentPiece.checkerStates.SELECTED){
                    this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
                }

                this.scene.orchestrator.currentState = new ZombieTileState(this.scene);     
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

    playAgain(){
    }





}