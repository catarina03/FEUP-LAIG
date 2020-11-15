class MyAnimation {
    /**
     * Abstract animation constructor.
     * classe base para aplicar a animaçoes
     * @param {number} startTime - in seconds
     * @param {string} id - ID of MyAnimation 
     */
    constructor(scene,  id) {
        this.scene = scene;
        this.id = id;
      
        //this.startTime = startTime;
        //this.endTime = endTime;
        //this.startTransformations = startTransformations;//array de 3 vec3
        //this.endTransformations = endTransformations;//array de 3 vec3

        this.finished=false;

        this.timeElapsed = 0;

        this.animationMatrix = mat4.create();
    }


      update(currentTime){  //abstract function
        
        //abstract method to be overriden by KeyFrameAnimation
        //check if animation is active,if not,return
        //calculate animations elapsed time using deltatime
        //calculate current values for each transformation,if currentTime < endTime

    


      }   

    //metodo update que recebe o instante atual(determinado pela cgfscene)

    apply(){  //abstract function
         //If current state is vec3
            //scene.translate
            //screen.rotate x3
            //screen.scale
        //else current state is matrix
            //scene.multMatrix




    }



}


 
