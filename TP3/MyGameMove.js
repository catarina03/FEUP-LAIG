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

        this.tile = null;
        this.destinationRow = destinationRow;
        this.destinationColumn = destinationColumn;
        this.state = null;
        this.prologBoard = null;

        this.eatenPiece = null;
        this.eatenRow = null;
        this.eatenColumn = null;
        
    }
}