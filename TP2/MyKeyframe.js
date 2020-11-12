class MyKeyframe {


    

    constructor(instant, transformations) {    
        this.instant = instant;  //time do inicio da keyframe

        this.transformations = transformations;//array composed by [translation,rotationx,rotationy,rotationz,scaling]
                                               //with translation and scaling as vec3

        this.currentTransl = null; // transformations[0];
        this.currentRotx = null; //transformations[1][0];
        this.currentRoty = null; //transformations[1][1];
        this.currentRotz = null; //transformations[1][2];
        this.currentScale =  null; //transformations[2];                                        

        
    }                                          





}