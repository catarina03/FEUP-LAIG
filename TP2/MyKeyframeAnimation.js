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
        super(scene, startTime, endTime, startTransformations, endTransformations);
        
        this.keyframes = [];//array de objetos mykeyframe
        
        this.currentTransl = vec3.fromValues(0.0, 0.0, 0.0) ;
        this.currentRotx = 0.0;
        this.currentRoty = 0.0;
        this.currentRotz = 0.0;
        this.currentScale = vec3.fromValues(1.0,1.0,1.0);

        this.startTime = 0;
        this.stage = 0;

        this.currentState = null;//current state is calculated by interpolation and its equal to
        // 
    }

    /**
     * Apply transformations to the scene
     */
    apply(){
        this.scene.translate(this.currentTransl[0], this.currentTransl[1], this.currentTransl[2]);
        this.scene.rotate(this.currentRotz * Math.PI / 180, 0, 0, 1);
        this.scene.rotate(this.currentRoty * Math.PI / 180, 0, 1, 0);
        this.scene.rotate(this.currentRotx * Math.PI / 180, 1, 0, 0);
        this.scene.scale(this.currentScale[0], this.currentScale[1], this.currentScale[2]);
    }



    update(currentTime){
        

        

        if(this.stage < this.keyframes.length ){//se a animaçao estiver ativa




         // auxiliares para guardar o valor intermedio das keyframes

            let translX;
            let translY;
            let translZ;

           
            let rotX;
            let rotY;
            let rotZ;

            
            let scaleX;
            let scaleY;
            let scaleZ;


          
            if(this.stage > 0){
                deltaTime = this.currentTime - this.keyframes[stage-1].instant;

                //calculo dos valores entre a keyframe anterior e a keyframe seguinte
                translX = this.keyframes[this.stage].transformations[0][0] - this.keyframes[this.stage-1 ].transformations[0][0];
                translY = this.keyframes[this.stage].transformations[0][1] - this.keyframes[this.stage-1 ].transformations[0][1];
                translZ = this.keyframes[this.stage].transformations[0][2] - this.keyframes[this.stage-1 ].transformations[0][2];

                rotX = this.keyframes[this.stage].transformations[1] - this.keyframes[this.stage-1 ].transformations[1];
                rotY = this.keyframes[this.stage].transformations[2] - this.keyframes[this.stage-1 ].transformations[2];
                rotZ = this.keyframes[this.stage].transformations[3] - this.keyframes[this.stage-1 ].transformations[3];
                
                scaleX = this.keyframes[this.stage].transformations[4][0] - this.keyframes[this.stage-1 ].transformations[4][0];
                scaleY = this.keyframes[this.stage].transformations[4][1] - this.keyframes[this.stage-1 ].transformations[4][1];
                scaleZ = this.keyframes[this.stage].transformations[4][2] - this.keyframes[this.stage-1 ].transformations[4][2];
               
            }







            if(this.stage==0){
                 deltaTime = this.currentTime;
                 currentValue = value * this.timeElapsed/this.keyframes[this.stage + 1].instant;

                





            }


     


            //se o elapsed time for igual ou inferior ao tempo correspondente 
            //entao fazer a interpolaçao


            //se o elapsed time for superior ao tempo correspondente
            //ao intervalo entre a keyframe atual e a seguinte
            //entao fazer stage++
        

          if(this.timeElapsed > (this.keyframes[this.stage+1].instant-this.keyframes[this.stage].instant)){//se o stage atual ja acabou
              this.stage++;
              this.timeElapsed=0;
          }

          else{//estamos a meio dum stage logo e necessario fazer a interpolaçao
               

               currentValue = this.keyframes[this.stage].instant + value * this.timeElapsed/this.keyframes[this.stage + 1].instant;



          }


        this.timeElapsed += deltaTime;
    }


//animaçao nao esta ativa
   else{
       this.finished=true;
       return null; 
       }

    

    }

}