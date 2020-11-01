/**
* MyKeyframeAnimation class
*/
class MyKeyframeAnimation extends MyAnimation {
    /**
     * @constructor
     * @param {number} startTime - in seconds
     * @param {number} endTime - in seconds
     * @param {matrix} startTransformations 
     * @param {matrix} endTransformations 
     */
    constructor(scene, startTime, endTime) {
        super(scene, startTime, endTime, startTransformations, endTransformations);

        this.keyframes = [];

        this.stage = 0;

        this.currentState = null;//current state is calculated by interpolation 
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
        
        this.scene.multMatrix(this.animationMatrix);
    }

    update(currentTime){
        if (!this.finished){

            if(this.stage == 0){
                deltaTime = this.currentTime;
            }
            else{
                deltaTime = this.currentTime - this.keyframes[stage-1].instant;
            }

            if(this.stage == 0){
                currentValue = value * this.timeElapsed/this.keyframe[this.stage + 1].instant;
            }
            else{
                currentValue = this.keyframe[this.stage].instant + value * this.timeElapsed/this.keyframe[this.stage + 1].instant;
            }
        }



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



        this.timeElapsed += currentTime;
    }


}