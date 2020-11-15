/**
* MyKeyframeAnimation class
*/
class MyKeyframeAnimation extends MyAnimation {
    /**
     * MyKeyframeAnimation constructor
     * @param {*} scene - MySceneGraph
     * @param {*} id - ID of the KeyframeAnimation
     */
    constructor(scene, id) {
        super(scene, id);
        
        this.keyframes = [];    //array de objetos mykeyframe
        
        this.currentTransl = vec3.fromValues(0.0, 0.0, 0.0) ;
        this.currentRotation = vec3.fromValues(0.0, 0.0, 0.0) ;
        this.currentScale = vec3.fromValues(1.0,1.0,1.0);

        //this.startTime = startTime;
        //this.endTime = endTime;

        this.startTime = 0;
        this.timeElapsed = 0;
        this.timeLastUpdate = 0;

        this.stage = 0;
    }


    /**
     * Apply transformations to the scene
     */
    apply(){
        this.scene.translate(this.currentTransl[0], this.currentTransl[1], this.currentTransl[2]);
        this.scene.rotate(this.currentRotation[0], 1, 0, 0);
        this.scene.rotate(this.currentRotation[1], 0, 1, 0);
        this.scene.rotate(this.currentRotation[2], 0, 0, 1);
        this.scene.scale(this.currentScale[0], this.currentScale[1], this.currentScale[2]);
    }


    /**
     * Updates all KeyframeAnimation data
     * @param {*} currentTime - current time on ms
     */
    update(currentTime){
        //Calculates animation start time
        if (this.timeElapsed == 0){
            this.startTime = currentTime;
            this.timeElapsed = currentTime
        }

        //Calculates deltaTime
        let deltaTime
        if (deltaTime == undefined)
            deltaTime = 0

        if (this.stage < this.keyframes.length && this.stage > 0){
            deltaTime = (currentTime - this.timeLastUpdate)/1000
        }
    
        //If the animation is not over
        if(this.stage < this.keyframes.length){

            //Verifies if the animation can start
            if (this.stage == 0 && (currentTime - this.startTime)/1000 >= this.keyframes[0].instant){
                this.stage++;
            }
         
            //Checks if animation can pass to the next stage
            if (this.stage < this.keyframes.length){
                if((currentTime - this.startTime)/1000 >= (this.keyframes[this.stage].instant)){
                    this.stage++;
                }
            }

            //We're in the middle of a stage so we can interpolate
            if(this.stage > 0 && this.stage < this.keyframes.length){
            
                //Percentage of time passed since last update in this stage
                let timePercentage = deltaTime/(this.keyframes[this.stage].instant - this.keyframes[this.stage-1].instant)

                //TRANSLATION
                this.currentTransl[0] += (this.keyframes[this.stage].Transl[0] - this.keyframes[this.stage - 1].Transl[0]) * timePercentage;
                this.currentTransl[1] += (this.keyframes[this.stage].Transl[1] - this.keyframes[this.stage - 1].Transl[1]) * timePercentage;
                this.currentTransl[2] += (this.keyframes[this.stage].Transl[2] - this.keyframes[this.stage - 1].Transl[2]) * timePercentage;

                //ROTATION
                this.currentRotation[0] += (this.keyframes[this.stage].Rotation[0] - this.keyframes[this.stage - 1].Rotation[0]) * DEGREE_TO_RAD * timePercentage;
                this.currentRotation[1] += (this.keyframes[this.stage].Rotation[1] - this.keyframes[this.stage - 1].Rotation[1]) * DEGREE_TO_RAD * timePercentage;
                this.currentRotation[2] += (this.keyframes[this.stage].Rotation[2] - this.keyframes[this.stage - 1].Rotation[2]) * DEGREE_TO_RAD * timePercentage;

                //SCALE
                this.currentScale[0] += (this.keyframes[this.stage].Scale[0] - this.keyframes[this.stage - 1].Scale[0]) * timePercentage;
                this.currentScale[1] += (this.keyframes[this.stage].Scale[1] - this.keyframes[this.stage - 1].Scale[1]) * timePercentage;
                this.currentScale[2] += (this.keyframes[this.stage].Scale[2] - this.keyframes[this.stage - 1].Scale[2]) * timePercentage;
            }
        }
        else{    
            //If animation has finished
            this.finished=true;
            return null; 
        }
        
        this.timeElapsed += deltaTime;
        this.timeLastUpdate = currentTime;
    }

    
}