/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();

        this.lightsFolder = null;
        this.sceneFolder = null;
        this.viewsFolder = null;
        this.commandsFolder = null;

    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        //Checkbox element in GUI
        //this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        
        this.gui.add(this.scene, 'zoom', 0.1, 8).name('Zoom');

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    /**
     * Adds lights to the User Interface
     */
    addLightsGUI(){
        var keyNames=Object.keys(this.scene.graph.lights);

        this.lightsFolder=this.gui.addFolder('Lights');

        for(let i= 0; i<keyNames.length;i++)
            this.lightsFolder.add(this.scene.lights[i],'enabled').name(keyNames[i]); 
    }


    addScenesGUI(){
        this.sceneFolder = this.gui.addFolder("Scene");
        this.sceneFolder.open();

        let scene = this.scene;

        this.sceneFolder.add(this.scene, "currentScene" , ["garden", "tree"]).name("Current Scene").onChange(function(value) {
            scene.changeScene(value);
        });
    }

    /**
     * Adds cameras to the User Interface
     */
    addCamerasGUI(){ 
        this.viewsFolder = this.gui.addFolder('Views');
        this.viewsFolder.open();

        const viewArray = Object.keys(this.scene.graph.views);

        this.currView = this.scene.graph.defaultView;

        this.viewsFolder.add(this, 'currView', viewArray).name('Camera').onChange(val => this.scene.chooseView(val));

    }

    addGameCommandsGUI(){
        this.commandsFolder = this.gui.addFolder("Game");
        this.commandsFolder.open();

        this.commandsFolder.add(this.scene.orchestrator.currentState, 'startHumanHuman').name("Human vs Human");
        this.commandsFolder.add(this.scene.orchestrator.currentState, 'start').name("Human vs PC");
        this.commandsFolder.add(this.scene.orchestrator.currentState, 'start').name("PC vs Human");
        this.commandsFolder.add(this.scene.orchestrator.currentState, 'start').name("PC vs PC");

        //this.commandsFolder.add(this.scene.orchestrator, 'startGame').name("Start");
        this.commandsFolder.add(this.scene.orchestrator.gameSequence, 'undoGameMove').name('Undo');
    }
}