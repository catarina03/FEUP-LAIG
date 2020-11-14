class MyKeyframe {


    

    constructor(instant, transformations) {    
        this.instant = instant;  //time do inicio da keyframe

        this.transformations = transformations;//array composed by [translation,rotationx,rotationy,rotationz,scaling]
                                               //with translation and scaling as vec3

        this.Transl = transformations[0];
        this.Rotx = null; //transformations[1][0];
        this.Roty = null; //transformations[1][1];
        this.Rotz = null; //transformations[1][2];
        this.Scale =  null; //transformations[2];                                        

        
    }                                          





}