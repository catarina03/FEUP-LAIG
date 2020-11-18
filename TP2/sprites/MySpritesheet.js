class MySpriteSheet extends CGFobject {

    constructor(scene, texture, sizeM, sizeN){
        super(scene);

        this.texture=texture;
        this.sizeM=sizeM;    //number of collumns
        this.sizeN=sizeN;    //number of rows

        this.binderID = null;

        this.shader = null; //new CGFshader(this.scene.gl, "../shaders/shader.vert", "../shaders/shader.frag");
        this.appearance = null;
    }


    activateCellMN(row_cell, column_cell, sideSize_cell){
        this.scene.fontShader.setUniformsValues({row: row_cell, column: column_cell, sizeM: this.sizeM, sizeN: this.sizeN, sideSize: sideSize_cell})
    }


    activateCellP(position, sideSize_cell){
        let column = position % this.sizeM
        let row = Math.floor(position / this.sizeM)
        console.log(column + " - " + row)
        this.shader.setUniformsValues({row: row, column: column, sizeM: this.sizeM, sizeN: this.sizeN, sideSize: sideSize_cell})
    }



}