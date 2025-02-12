/**
 * OrcPieceState
 */
class OrcPieceState extends MyGameState{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     */
    constructor(scene) {
        super(scene);


    };
    
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