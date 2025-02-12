class MyKeyframe {
    /**
     * Constructor
     * @param {*} instant - keyframe instant
     * @param {*} transformations - trasformation matrix
     */
    constructor(instant, transformations) {    
        this.instant = instant;  //time do inicio da keyframe

        this.transformations = transformations;//array composed by [translation,rotationx,rotationy,rotationz,scaling]
                                               //with translation and scaling as vec3

        this.Transl = transformations[0];
        this.Rotation = transformations[1];

        this.Rotx = transformations[1][0];
        this.Roty = transformations[1][1];
        this.Rotz = transformations[1][2];

        this.Scale =  transformations[2];                                        
    }                                          

}