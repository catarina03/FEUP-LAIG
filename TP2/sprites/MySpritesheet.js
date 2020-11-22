class MySpriteSheet extends CGFobject {
    /**
     * Constructor
     * @param {*} scene - refers to MyScene object
     * @param {*} texture - texture to be used as spritesheet
     * @param {*} sizeM - number of columns of spritesheet
     * @param {*} sizeN - number of rows of spritesheet
     */
    constructor(scene, texture, sizeM, sizeN){
        super(scene);

        this.texture=texture;
        this.sizeM=sizeM;    //number of collumns
        this.sizeN=sizeN;    //number of rows

        this.binderID = null;

        this.shader = null; //new CGFshader(this.scene.gl, "../shaders/shader.vert", "../shaders/shader.frag");
        this.appearance = null;
    }


    /**
     * Transfers values to shader used
     * @param {*} row_cell - number of row
     * @param {*} column_cell - number of column
     * @param {*} sideSize_cell - size of the cell
     */
    activateCellMN(row_cell, column_cell, sideSize_cell){
        this.shader.setUniformsValues({row: row_cell, column: column_cell, sizeM: this.sizeM, sizeN: this.sizeN, sideSize: sideSize_cell})
    }


    /**
     * Calculates values and transfers them to shader
     * @param {*} position - current position of cell to be displayed
     * @param {*} sideSize_cell - size of the cell
     */
    activateCellP(position, sideSize_cell){
        let column = position % this.sizeM
        let row = Math.floor(position / this.sizeM)

        this.shader.setUniformsValues({row: row, column: column, sizeM: this.sizeM, sizeN: this.sizeN, sideSize: sideSize_cell})
    }



}