/**
 * GameOverState
 */
class GameOverState extends CGFobject{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     * @param player - ID of the component
     */
    constructor(scene) {
        super(scene);    

    };


    async onObjectSelected(obj, id) {
        let decision = this.yes;

        console.log("FINAL SCORE: ");
        console.log(this.scene.orchestrator.scores);
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