/**
* MyKeyframeAnimation class
*/
class MyKeyframeAnimation extends MyAnimation {
    /**
     * @constructor
     * @param {number} startTime - in seconds
     * @param {number} endTime - in seconds
     * @param {array of vec3 and rotation angles}startTransformations [vec3 translation,float rotationx,float rotationy,float rotationz,vec3 scaling];
     * @param {array of vec3 and rotation angles} endTransformations 
     */
    constructor(scene, startTime, endTime) {
        super(scene, startTime, endTime);
        
        this.keyframes = [];//array de objetos mykeyframe
        
        this.currentTransl = vec3.fromValues(0.0, 0.0, 0.0) ;
        this.currentRotation = vec3.fromValues(0.0, 0.0, 0.0) ;
        this.currentRotx = 0.0;
        this.currentRoty = 0.0;
        this.currentRotz = 0.0;
        this.currentScale = vec3.fromValues(1.0,1.0,1.0);

        this.startTime = startTime;
        this.endTime = endTime;

        this.timeElapsed = 0;
        this.timeLastUpdate = 0;

        this.stage = 0;

        this.currentState = null;//current state is calculated by interpolation and its equal to
        // 

        //this.beginningTime = 0;
        this.currentInstant = 0;
        this.startTime = 0;

    }

    /**
     * Apply transformations to the scene
     */
    apply(){
        console.log(this.stage)
        console.log("APPLY DA ANIMATION")
        console.log(this.currentRotation[0])
        console.log(this.currentRotation[1])
        console.log(this.currentRotation[2])

        this.scene.translate(this.currentTransl[0], this.currentTransl[1], this.currentTransl[2]);
        this.scene.rotate(this.currentRotation[0], 1, 0, 0);
        this.scene.rotate(this.currentRotation[1], 0, 1, 0);
        this.scene.rotate(this.currentRotation[2], 0, 0, 1);
        this.scene.scale(this.currentScale[0], this.currentScale[1], this.currentScale[2]);
    }



    update(currentTime){

        if (this.timeElapsed == 0){
            //Calculates animation start time
            this.startTime = currentTime;
            this.timeElapsed = currentTime
        }
        
        
        let deltaTimeTotal = (currentTime - this.startTime)/1000

        let deltaTimeSegment
        if (deltaTimeSegment == undefined)
            deltaTimeSegment = 0

        if (this.stage < this.keyframes.length && this.stage > 0){
            //Time used for interpolation - current time since this keyframe started 
            //let totalStageTime = (currentTime - this.startTime)/1000 - this.keyframes[this.stage - 1].instant
            //let deltaTimeSegmentIntermidiate = totalStageTime
            //deltaTimeSegment = deltaTimeSegmentIntermidiate - deltaTimeSegment

            deltaTimeSegment = (currentTime - this.timeLastUpdate)/1000
            console.log("DELTA TIME IN A SEGMENT CARALHO: " + deltaTimeSegment)

        }
    
        if(this.stage < this.keyframes.length ){    //se a animaçao não tiver acabado

            if (this.stage == 0 && this.keyframes[0].instant <= (currentTime - this.startTime)/1000){
                this.stage++;
            }

            // auxiliares para guardar o "value"
            let translX;
            let translY;
            let translZ;

            let rotX;
            let rotY;
            let rotZ;

            let scaleX;
            let scaleY;
            let scaleZ;

            //let deltaTime;


          /*
            if(this.stage > 0){
                deltaTime = this.currentTime - this.keyframes[this.stage-1].instant;

                
                //calculo dos valores entre a keyframe anterior e a keyframe seguinte(aka value)
                translX = this.keyframes[this.stage].transformations[0][0] - this.keyframes[this.stage-1].transformations[0][0];
                translY = this.keyframes[this.stage].transformations[0][1] - this.keyframes[this.stage-1].transformations[0][1];
                translZ = this.keyframes[this.stage].transformations[0][2] - this.keyframes[this.stage-1].transformations[0][2];

                rotX = this.keyframes[this.stage].transformations[1] - this.keyframes[this.stage -1].transformations[1];
                rotY = this.keyframes[this.stage].transformations[2] - this.keyframes[this.stage -1].transformations[2];
                rotZ = this.keyframes[this.stage].transformations[3] - this.keyframes[this.stage -1].transformations[3];
                
                scaleX = this.keyframes[this.stage].transformations[4][0] - this.keyframes[this.stage -1].transformations[4][0];
                scaleY = this.keyframes[this.stage].transformations[4][1] - this.keyframes[this.stage -1].transformations[4][1];
                scaleZ = this.keyframes[this.stage].transformations[4][2] - this.keyframes[this.stage -1].transformations[4][2];
                
               
            }

            */

          //se o elapsed time for igual ou inferior ao tempo correspondente 
          //entao fazer a interpolaçao


          //se o elapsed time(duraçao atual da animaçao) for superior ao tempo correspondente
          //ao inicio da proxima keyframe entao fazer stage++,ou seja,passar ao proximo stage
          
        
            if (this.stage < this.keyframes.length){
                if((currentTime - this.startTime)/1000 > (this.keyframes[this.stage].instant)){
                    //se o stage atual ja acabou muda para o stage seguinte
                    this.stage++;
                }
            }

            if(this.stage > 0 && this.stage < this.keyframes.length){//estamos no decorrer dum stage logo e necessario fazer a interpolaçao
            
                console.log(deltaTimeSegment + " SEGMENT AMOUNT")

                let segmentAmount = deltaTimeSegment/(this.keyframes[this.stage].instant - this.keyframes[this.stage-1].instant)

                //TRANSLATION
                this.currentTransl[0] += (this.keyframes[this.stage].Transl[0] - this.keyframes[this.stage - 1].Transl[0]) * segmentAmount;
                this.currentTransl[1] += (this.keyframes[this.stage].Transl[1] - this.keyframes[this.stage - 1].Transl[1]) * segmentAmount;
                this.currentTransl[2] += (this.keyframes[this.stage].Transl[2] - this.keyframes[this.stage - 1].Transl[2]) * segmentAmount;


                //ROTATION
                console.log("ROTATION ---------------------")
                console.log("X: " + this.keyframes[this.stage].Rotation[0] + " - " + this.keyframes[this.stage - 1].Rotation[0])
                console.log("Y: " + this.keyframes[this.stage].Rotation[1] + " - " + this.keyframes[this.stage - 1].Rotation[1])
                console.log("Z: " + this.keyframes[this.stage].Rotation[2] + " - " + this.keyframes[this.stage - 1].Rotation[2])

                this.currentRotation[0] += (this.keyframes[this.stage].Rotation[0] - this.keyframes[this.stage - 1].Rotation[0]) * DEGREE_TO_RAD * segmentAmount;
                this.currentRotation[1] += (this.keyframes[this.stage].Rotation[1] - this.keyframes[this.stage - 1].Rotation[1]) * DEGREE_TO_RAD * segmentAmount;
                this.currentRotation[2] += (this.keyframes[this.stage].Rotation[2] - this.keyframes[this.stage - 1].Rotation[2]) * DEGREE_TO_RAD * segmentAmount;

                //SCALE
                console.log("SCALE ---------------------")
                console.log("X: " + this.keyframes[this.stage].Scale[0] + " - " + this.keyframes[this.stage - 1].Scale[0])
                console.log("Y: " + this.keyframes[this.stage].Scale[1] + " - " + this.keyframes[this.stage - 1].Scale[1])
                console.log("Z: " + this.keyframes[this.stage].Scale[2] + " - " + this.keyframes[this.stage - 1].Scale[2])
                this.currentScale[0] += (this.keyframes[this.stage].Scale[0] - this.keyframes[this.stage - 1].Scale[0]) * segmentAmount;
                this.currentScale[1] += (this.keyframes[this.stage].Scale[1] - this.keyframes[this.stage - 1].Scale[1]) * segmentAmount;
                this.currentScale[2] += (this.keyframes[this.stage].Scale[2] - this.keyframes[this.stage - 1].Scale[2]) * segmentAmount;
                
            }


        //this.timeElapsed += deltaTime;//time elapsed é o tempo desde o inicio da animaçao ate agora

        }
        else{    // caso a animaçao já tenha acabado
            this.finished=true;
            return null; 
        }
        //this.timeElapsed += deltaTimeTotal;

        this.timeLastUpdate = currentTime;
    }


}