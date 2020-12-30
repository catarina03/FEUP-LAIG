/**
 * MyGameSequence class, which represents a the sequences of moves in a Game
 */
class MyGameSequence extends CGFobject {
    /**
     * @constructor
     * @param {MyBoard} scene  represents the Board of a Game
     */
    constructor(scene) {
        super(scene);

        this.moves = [];
    }

    
    addGameMove(move) {
        this.moves.push(move);
        /*

        this.board.addPiece(finalX, finalZ, pieceSelected);
        this["sideBoard" + n_board].removePiece(n_piece);

        let positionOfSideBoard = this["positionOfSideBoard" + n_board];
        pieceSelected.setAnimation(positionOfSideBoard, n_piece, finalX, finalZ, this.board.isPieceLow(finalX, finalZ));

        this.moves.push(new MyGameMove(pieceSelected, n_board, n_piece, finalX, finalZ));
        */
    }

    undoGameMove(){
        this.moves.pop();
        //POrecisa de animação também
    }
    





}