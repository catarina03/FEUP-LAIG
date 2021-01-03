/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);     

        this.sceneInited = false;
        this.displayAxis = true;
        this.zoom = 2;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);


        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);
        this.currentScene = "garden";


        //SPRITETEXT
        
        this.appearance = new CGFappearance(this);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);
        
        this.fontTexture = new CGFtexture(this, "scenes/images/font_sprite2.png");
        this.fontTexture.bind(0);

		//this.appearance.setTexture(this.fontTexture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');
        
        this.fontShader = new CGFshader(this.gl, "shaders/shader.vert", "shaders/shader.frag");
        this.fontShader.setUniformsValues({ uSampler: 0});

        this.fontSpritesheet = new MySpriteSheet(this, this.fontTexture, 26, 5);
        this.fontSpritesheet.binderID = 0;
        this.fontSpritesheet.shader = this.fontShader;
        this.fontSpritesheet.appearance = this.appearance;
        this.fontSpritesheet.texture = this.fontTexture;


        
        // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
        // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
        var filename1=getUrlVars()['file'] || "garden.xml";
        var filename2=getUrlVars()['file'] || "tree.xml";

        // create and load graph, and associate it to scene. 
        // Check console for loading errors
        var myGraph1 = new MySceneGraph(filename1, this);
        var myGraph2 = new MySceneGraph(filename2, this);
        
        this.graphNames = ["garden","tree"];
        this.graphs = [myGraph1, myGraph2];
        //this.graphNames = ["garden"];
        //this.graphs =[myGraph1],
        

        this.orchestrator = new MyGameOrchestrator(this);


        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {         
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.setUpdatePeriod(50);

        this.initLights();
        this.initViews();

        this.interface.addLightsGUI();
        this.interface.addScenesGUI();
        this.interface.addCamerasGUI();
        this.interface.addGameCommandsGUI();

        console.log(this.graph);
        console.log("-----------------------");

        this.sceneInited = true;
        //this.currentScene = this.graphs[0];
        this.graph = this.graphs[0];
    }


    update(time){
        if (this.sceneInited){
            this.graph.root.updateAnimation(time);
        }    
        
        for (let checker in this.orchestrator.board.checkers){
            if(this.orchestrator.board.checkers[checker].animation != null) {
                this.orchestrator.board.checkers[checker].animation.update(time);
            }
        }
    }


    initViews(){
        this.camera = this.graph.views[this.graph.defaultView];
        this.interface.setActiveCamera(this.camera);

        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.views) {

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();
                
            }
        } 
    }


    chooseView(val){
        this.newViewID = val;
        console.log(this.newViewID);
        console.log(this.camera);
        this.camera = this.graph.views[this.newViewID];
        console.log(this.camera);
        this.interface.setActiveCamera(this.camera);
    }


    updateScene(){
        for (let i = 0; i < this.lights.length; i++){
            this.lights[i].disable();
            this.lights[i].update();
        }

        this.interface.gui.removeFolder(this.interface.viewsFolder);
        this.interface.gui.removeFolder(this.interface.lightsFolder);
        //this.gui.destroy(); 
        
        var index = 0;
        
        for (let i = 0; this.graphNames.length; i++){
            if (this.orchestrator.theme == this.graphNames[i]){
                index = i;
                break;
            }
        }
        
        console.log(this.graph);
        //this.gui = new dat.GUI();
        this.graph = this.graphs[index];
        console.log(this.graph);
        //this.axis = new CGaxis(this, this.graph.referenceLength);
        this.gl.clearColor(...this.graph.background);
        this.setGlobalAmbientLight(...this.graph.ambient);
        this.initLights();
        this.initViews();
        this.sceneInited = true;
        this.orchestrator.theme = this.graphNames[index];
        this.interface.addLightsGUI();
        this.interface.addCamerasGUI();

    }


    changeScene(filename) {
        /*
        this.sceneChanged = true;
        this.sceneInited = false;
        let myGraph = new MySceneGraph(filename + '.xml', this);
        */
        
        //this.sceneInited = false;
        this.updateScene();
        //this.graph.reader.open('scenes/' + filename + '.xml', this.graph);
        this.graph.filename = filename + '.xml';
    }


    rotateCamera(player){
        this.rotatingCamera = true;
        this.initiateRotation = true;
        this.currentPlayer = player;

        if(this.orchestrator.player == "o")
            this.camera = this.graph.views['OrcView'];
        else this.camera = this.graph.views['GoblinView'];

        this.updateCamera(this.camera);
    }


	logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
						console.log("Picked object: " + obj + ", with pick id " + customId);						
					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
	}


    /**
     * Displays the scene.
     */
    display() {
        //this.logPicking();
        this.clearPickRegistration();
        
        this.orchestrator.currentState.managePick(this.pickMode,this.pickResults);

        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        
        if(this.displayAxis) this.axis.display();

        this.scale(this.zoom/2, this.zoom/2, this.zoom/2);


        for(var i=0;i<this.lights.length;i++)
        this.lights[i].update();
        
        if (this.sceneInited) {
            if(this.displayAxis) this.axis.display();
            
            
            // Displays the scene (MySceneGraph function).
            //this.graph[0].displayScene();
            this.graph.displayScene();

            this.orchestrator.board.display();
            this.orchestrator.auxiliarBoard.display();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}