class MyAnimation {
    /**
     * Abstract animation constructor.
     * classe base para aplicar a animaçoes
     * @param {number} startTime - in seconds
     * @param {number} endTime - in seconds
     * @param {matrix} startTransformations - translation,rotationx,rotationy,rotationz,scale
     * @param {matrix} endTransformations - translation,rotationx,rotationy,rotationz,scale
     */
    constructor(startTime,endTime,startTransformations,endTransformations) {
        this.startTime = startTime;
        this.endTime=endTime;
        this.startTransformations=startTransformations;
        this.endTransformations=endTransformations;
        this.finished=false;
    }


      update(currentTime){   
        //abstract method to be overriden by KeyFrameAnimation
        //check if animation is active,if not,return
        //calculate animations elapsed time using deltatime
        //calculate current values for each transformation,if currentTime < endTime

      }   

    //metodo update que recebe o instante atual(determinado pela cgfscene)

    apply(){
         //If current state is vec3
            //scene.translate
            //screen.rotate x3
            //screen.scale
        //else current state is matrix
            //scene.multMatrix




    }



}


 
