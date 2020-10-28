/**
* MyKeyframeAnimation class
*/
class MyKeyframeAnimation extends MyAnimation {
    /**
     * @constructor
     * @param {number} startTime - in seconds
     * @param {number} endTime - in seconds
     * @param {vec3} startTransformations 
     * @param {vec3} endTransformations 
     */
    constructor(startTime, endTime, startTransformations, endTransformations) {
        super(startTime, endTime, startTransformations, endTransformations);

        this.keyframe = [];

        this.currentState = null;
    }

    /**
     * Apply transformations to the scene
     */
    apply(){
        //If current state is vec3
            //scene.translate
            //screen.rotate x3
            //screen.scale
        //else current state is matrix
            //scene.multMatrix
    }

    update(currentTime){
        //Check if animation is active, else return null

        //Calculate animations elapsed time using delta time

        //Calculate current values for each transformation
            //Get previous and next keyframe

            //For each value: X  = Xi + Xtotal * ( Telapsed/Ttotal)
            //X - current value
            //Xi -value in previous keyframe
            //Xtotal - value between previous and next keyframe
            //Telapsed - time from start until now
            //Ttotal - time of next keyframe
        
        //Update current state (matrix or vec3) and other variables
    }


}