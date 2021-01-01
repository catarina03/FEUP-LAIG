/**
 * ChoiceState
 */
class ChoiceState extends CGFobject{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     * @param player - ID of the component
     */
    constructor(scene, yes, no) {
        super(scene);

        this.yes = yes;
        this.no = no;      

    };


    async onObjectSelected(obj, id) {
        let decision = this.yes;

        if (decision instanceof GoblinPieceState){
            console.log("Instance of Goblin");
            this.scene.orchestrator.player = "g";
            this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
        }
        else if (decision instanceof OrcPieceState){
            console.log("Instance of Orc");
            this.scene.orchestrator.player = "o";
            this.scene.orchestrator.currentPiece.currentState = this.scene.orchestrator.currentPiece.checkerStates.NOT_SELECTED;
        }

        console.log("Choice state");
        console.log(decision);
        console.log("Player: " + this.scene.orchestrator.player);
        this.scene.orchestrator.currentState = decision;
    }

    move(tile, destination){
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






}