//cilindro com raio da base superior igual ao raio da base inferior mas
//possui um raio interno no meio

/**
	 * Build a barrel using NURBS
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} base 
	 * @param {Number} middle 
	 * @param {Number} height 
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 */

class MydefBarrel extends CGFobject {

    constructor(scene,base,middle,height,slices,stacks){
        //u x/z
        //v y
        super(scene);
        this.r = base;
        this.R = middle;
        this.L = height;
        this.H = (this.R-this.r)*4/3;
        this.h = this.r*4/3;
        this.slices = slices;
        this.stacks = stacks;
       
        


        this.generateControlPoints();

       
        this.firsthalf = new MyPatch(scene,slices,stacks,4,4,this.controlpointsfirst);
        
      
        this.secondhalf = new MyPatch(scene,slices,stacks,4,4,this.controlpointsecond);

        this.display();
    }

   generateControlPoints() {
        //pontos de controlo correspondentes à primeira metade,de Y=0 para Y>0

        this.controlpointsfirst = [  [[this.r,0,0,1],
        [this.r+this.H,0,this.H/Math.tan(40*(Math.PI/180)),1],
        [this.r+this.H,0,this.L-this.H/Math.tan(40*(Math.PI/180)),1],
        [this.r,0,this.L,1]],

        [[this.r,this.h,0,1],
        [this.r+this.H,this.h+this.H/Math.tan(40*(Math.PI/180)),this.H/Math.tan(40*(Math.PI/180)),1],
        [this.r+this.H,this.h+this.H/Math.tan(40*(Math.PI/180)),this.L-this.H/Math.tan(40*(Math.PI/180)),1],
        [this.r,this.h,this.L,1]],

        [[-this.r,this.h,0,1],
        [-this.r-this.H,this.h+this.H/Math.tan(40*(Math.PI/180)),this.H/Math.tan(40*(Math.PI/180)),1],
        [-this.r-this.H,this.h+this.H/Math.tan(40*(Math.PI/180)),this.L-this.H/Math.tan(40*(Math.PI/180)),1],
        [-this.r,this.h,this.L,1]],

        [[-this.r,0,0,1],
        [-this.r-this.H,0,this.H/Math.tan(40*(Math.PI/180)),1],
        [-this.r-this.H,0,this.L-this.H/Math.tan(40*(Math.PI/180)),1],
        [-this.r,0,this.L,1]]
    ]   ;
        //pontos de controlo correspondentes à segunda metade,de Y=0 para Y<0

        this.controlpointsecond = [  [[-this.r,0,0,1],
        [-this.r-this.H,0,this.H/Math.tan(40*(Math.PI/180)),1],
        [-this.r-this.H,0,this.L-this.H/Math.tan(40*(Math.PI/180)),1],
        [-this.r,0,this.L,1]],

        [[-this.r,-this.h,0,1],
        [-this.r-this.H,-this.h-this.H/Math.tan(40*(Math.PI/180)),this.H/Math.tan(40*(Math.PI/180)),1],
        [-this.r-this.H,-this.h-this.H/Math.tan(40*(Math.PI/180)),this.L-this.H/Math.tan(40*(Math.PI/180)),1],
        [-this.r,-this.h,this.L,1]],

        [[this.r,-this.h,0,1],
        [this.r+this.H,-this.h-this.H/Math.tan(40*(Math.PI/180)),this.H/Math.tan(40*(Math.PI/180)),1],
        [this.r+this.H,-this.h-this.H/Math.tan(40*(Math.PI/180)),this.L-this.H/Math.tan(40*(Math.PI/180)),1],
        [this.r,-this.h,this.L,1]],

        [[this.r,0,0,1],
        [this.r+this.H,0,this.H/Math.tan(40*(Math.PI/180)),1],
        [this.r+this.H,0,this.L-this.H/Math.tan(40*(Math.PI/180)),1],
        [this.r,0,this.L,1]]
    ]   ;





    }

//dá display do objeto

    display(){
        this.firsthalf.display();
		this.secondhalf.display();


    }







    updateTexCoords(Sfactor,Tfactor) {
        this.updateTexCoordsGLBuffers();
    }


}


