/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
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




    addLightsGUI(){

        var keyNames=Object.keys(this.scene.graph.lights);

        var lightsFolder=this.gui.addFolder('Lights');

        lightsFolder.open();


        for(let i= 0; i<keyNames.length;i++)
            lightsFolder.add(this.scene.lights[i],'enabled').name(keyNames[i]); 

         }



    addCamerasGUI(){ 
        this.gui.add(this.scene.graph,'currentView',Object.keys(this.scene.graph.views)).name('View Points').onChange((val)=> {


        this.scene.camera=this.scene.graph.views[val];
        this.setActiveCamera(this.scene.camera);
        



        });


    }
}