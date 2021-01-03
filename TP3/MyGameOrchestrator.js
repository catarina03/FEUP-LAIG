class MyGameOrchestrator extends CGFobject {
    /**
     * Constructor of the class MyGameOrchestrator.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);

        this.currentState = new WaitingState(this.scene);

        this.prologBoard = [];
        this.player = "o";
        this.currentPiece = null;
        this.currentPieceRow = null;
        this.currentPieceColumn = null;
        this.currentTile = null;
        this.tileRow = null;
        this.tileColumn = null;
        this.possibleMoves = [];
        this.adjacentMoves = [];
        this.eatMoves = [];
        this.movementType = "";
        this.startingPoint = [];
        this.elemEaten = null;
        this.elemEatenRow = null;
        this.elemEatenColumn = null;
        this.elemEatenPlayer = null;
        this.greenSkull = "g";
        this.scores = [0,0,0];


        this.animatedCamera = null;

        /*
        near="0.1" far="300" angle="25">
            <from x="3" y="13" z="30" />
            <to x="3" y="1" z="5" />
            */
        this.server = new MyServer(scene);
        this.board = new MyGameBoard(scene);
        this.auxiliarBoard = new MyAuxiliarBoard(scene);
        this.gameSequence = new MyGameSequence(scene);
        this.responseMenu = new MyMenu(scene);
        this.theme = "garden";

        //this.state = new AwaitPieceState(scene);

        this.initPrologBoard();

    }

    initPrologBoard(){
        this.prologBoard = "[" +        
                "[e]," +          
                "[e,e]," +          
                "[z,e,z]," +         
                "[z,e,e,z]," +          
                "[e,e,z,e,e]," +          
                "[e,e,z,z,e,e]," +             
                "[g,e,e,z,e,e,o]," +       
                "[g,g,e,e,e,e,o,o]," +        
                "[g,g,g,e,e,e,o,o,o]," +   
                "[g,g,g,g,e,e,o,o,o,o]]";
    }


    update(time) {
        if (this.animatedCamera != undefined || this.animatedCamera != null)
            this.animatedCamera.update(time);
    }



}