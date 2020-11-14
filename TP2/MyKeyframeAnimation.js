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
        this.currentRotx = 0.0;
        this.currentRoty = 0.0;
        this.currentRotz = 0.0;
        this.currentScale = vec3.fromValues(1.0,1.0,1.0);

        this.startTime = startTime;
        this.endTime = endTime;

        this.timeElapsed = 0;

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
        console.log(this.currentTransl[0])
        console.log(this.currentTransl[1])
        console.log(this.currentTransl[2])

        this.scene.translate(this.currentTransl[0], this.currentTransl[1], this.currentTransl[2]);
        //this.scene.translate(this.currentTransl.x, this.currentTransl.y, this.currentTransl.z)

        this.scene.rotate(this.currentRotz * Math.PI / 180, 0, 0, 1);
        this.scene.rotate(this.currentRoty * Math.PI / 180, 0, 1, 0);
        this.scene.rotate(this.currentRotx * Math.PI / 180, 1, 0, 0);
        this.scene.scale(this.currentScale[0], this.currentScale[1], this.currentScale[2]);
    }



    update(currentTime){

        
        
        if (this.timeElapsed == 0){
            this.startTime = currentTime;
            this.timeElapsed = currentTime
        }
        
        
        let deltaTimeTotal = (currentTime - this.startTime)/1000

        let deltaTimeSegment
        if (this.stage < this.keyframes.length)
            deltaTimeSegment = (currentTime - this.startTime)/1000 - this.keyframes[this.stage].instant


        console.log((currentTime - this.startTime)/1000)
    
        if(this.stage < this.keyframes.length ){//se a animaçao estiver ativa

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


            if(this.stage==0){//neste stage nao e suposto ocorrer nada
                              // a animaçao so começa quando chegarmos à keyframe 0,até la
                              // o objeto está invisivel 
               //deltaTime = 0;

               // currentValue = value * this.timeElapsed/this.keyframes[this.stage + 1].instant;(feito na interpolaçao mais abaixo)
               //calculo do value:

            }


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
                if((currentTime - this.startTime)/1000 > (this.keyframes[this.stage].instant)){//se o stage atual ja acabou
                  this.stage++;
                }
            }

            if(this.stage > 0 && this.stage < this.keyframes.length){//estamos no decorrer dum stage logo e necessario fazer a interpolaçao
            
              // currentValue = this.keyframes[this.stage].instant + value * this.timeElapsed/this.keyframes[this.stage + 1].instant;
              
              //this.currentTransl[0] += (currentTime / deltaTime) * translX;
              //this.currentTransl[1] += (currentTime / deltaTime) * translY;
              //this.currentTransl[2] += ( currentTime / deltaTime) * translZ;

              console.log("deltaTimeSegment: " + deltaTimeSegment)
              console.log("keyframe 2 instante: " + this.keyframes[this.stage].instant)
              console.log("keyframe 1 instante: " + this.keyframes[this.stage-1].instant)
              let segmentAmount = deltaTimeSegment/(this.keyframes[this.stage].instant - this.keyframes[this.stage-1].instant)
              console.log(segmentAmount + " SEGMENT AMOUNT")
              vec3.lerp(this.currentTransl, this.keyframes[this.stage-1].Transl, this.keyframes[this.stage].Transl, segmentAmount) 
              console.log(this.currentTransl)
              console.log(this.keyframes[this.stage].Transl)
              console.log("-----------------------")

              /*
              this.currentRotx += (currentTime / deltaTime) * rotX;
              this.currentRoty += (currentTime / deltaTime) * rotY;
              this.currentRotz += (currentTime / deltaTime) * rotZ;

              this.currentScale[0] += (currentTime / deltaTime) * scaleX;
              this.currentScale[1] += (currentTime / deltaTime) * scaleY;
              this.currentScale[2] += (currentTime / deltaTime) * scaleZ;
              */
            }


        //this.timeElapsed += deltaTime;//time elapsed é o tempo desde o inicio da animaçao ate agora

        }
        else{    // caso a animaçao nao esteja ativa
        this.finished=true;
        return null; 
        }

        //this.timeElapsed += deltaTimeTotal;

    }



}