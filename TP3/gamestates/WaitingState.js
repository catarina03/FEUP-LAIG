/**
 * WaitingState
 */
class WaitingState extends MyGameState{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     */
    constructor(scene) {
        super(scene);
        this.scene.setPickEnabled(false);

    };


    startHumanHuman(){
        /*
        let camera = new MyAnimatedCamera(this.scene, this.scene.views["Perspective"], this.scene.views["OrcView"], 2);
        this.scene.orchestrator.animatedCamera = camera;
        this.scene.interface.setActiveCamera(this.scene.orchestrator.animatedCamera);
        
        console.log(this.scene.graph.views);
        console.log(this.scene.orchestrator.animatedCamera);
        */
        


        this.scene.setPickEnabled(true);
        this.scene.clearPickRegistration();
        this.scene.pickResults.splice(0, this.scene.pickResults.length);
        this.scene.orchestrator.currentState = new OrcPieceState(this.scene);
    }

    start(){

    }





}