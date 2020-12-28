/**
 * MyGameSequence class, which represents a the sequences of moves in a Game
 */
class MyGameMove extends CGFobject {
    /**
     * @constructor
     * @param {MyBoard} scene  represents the Board of a Game
     */
    constructor(scene, piece, startingRow, startingColumn, destinationRow, destinationColumn) {
        super(scene);

        this.piece = piece;
        this.startingRow = startingRow;
        this.startingColumn = startingColumn;
        this.destinationRow = destinationRow;
        this.destinationColumn = destinationColumn;

        this.eatenPiece = null;
        this.eatenRow = null;
        this.eatenColumn = null;
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


}