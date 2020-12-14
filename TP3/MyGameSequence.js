/**
 * MyGameSequence class, which represents a the sequences of moves in a Game
 */
class MyGameSequence extends CGFobject {
    /**
     * @constructor
     * @param {MyBoard} scene  represents the Board of a Game
     */
    constructor(gameBoard) {

        this.board = gameBoard;

        this.moves = [];

        this.pieceSelected = null;
    }

    /*
    addMove(pieceSelected, n_board, n_piece, finalX, finalZ) {

        this.board.addPiece(finalX, finalZ, pieceSelected);
        this["sideBoard" + n_board].removePiece(n_piece);

        let positionOfSideBoard = this["positionOfSideBoard" + n_board];
        pieceSelected.setAnimation(positionOfSideBoard, n_piece, finalX, finalZ, this.board.isPieceLow(finalX, finalZ));

        this.moves.push(new MyGameMove(pieceSelected, n_board, n_piece, finalX, finalZ));
    }
    */

    move(pieceSelected, destination){

    }




}