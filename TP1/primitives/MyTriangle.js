/*
  MyTriangle
  @constructor
 
 */

class MyTriangle extends CGFobject{
    constructor(scene, x1,y1,z1,x2,y2,z2,x3,y3,z3) {

        super(scene);

        this.v1 =vec3.fromValues(x1,y1,z1);
        this.v2 =vec3.fromValues(x2,y2,z2);
        this.v3 =vec3.fromValues(x3,y3,z3);

        this.initBuffers();
    };

    initBuffers(){

        
        this.vertices = [];
        
        //vertices
        this.vertices.push(this.v1[0],this.v1[1],this.v1[2]);
        this.vertices.push(this.v2[0],this.v2[1],this.v2[2]);
        this.vertices.push(this.v3[0],this.v3[1],this.v3[2]);

        //indices
        this.indices = [0,1,2];

        let v12=[ this.v2[0] - this.v1[0],
                  this.v2[1] - this.v1[1],
                  this.v2[2] - this.v1[2] ];
            
        let v13=[ this.v3[0] - this.v1[0],
                  this.v3[1] - this.v1[1],
                  this.v3[2] - this.v1[2] ];
       //normals
       let normal = vec3.create();
       vec3.cross(normal,v12,v13);
       vec3.normalize(normal,normal);           

       this.normals = [
            normal[0],normal[1],normal[2],
            normal[0],normal[1],normal[2],
            normal[0],normal[1],normal[2] ];  

       this.a=Math.sqrt( Math.pow(v12[0],2) + Math.pow(v12[1],2)+ Math.pow(v12[2],2));
       this.b=Math.sqrt(Math.pow(this.v3[0] - this.v2[0],2)  + Math.pow(this.v3[1] - this.v2[1],2) + Math.pow(this.v3[2]- this.v2[2],2));        
       this.c=Math.sqrt(Math.pow(v13[0],2) + Math.pow(v13[1],2) + Math.pow(v13[2],2) );                               


       this.cosAlpha = ( this.a * this.a - this.b *this.b + this.c*this.c ) / (2 * this.a * this.c)

       this.sinAlpha=Math.sqrt(1 - this.cosAlpha * this.cosAlpha);


       this.texCoords=[
            0, 1,
            1, 1,
            this.c*this.cosAlpha,this.c*this.sinAlpha
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();


    };

    updateTexCoords(Sfactor,Tfactor){
        
        this.texCoords = [
             0,0,
             this.a/Sfactor,0,
             (this.c*this.cosAlpha)/ Sfactor,(this.c*this.sinAlpha)/Tfactor

        ];


        this.updateTexCoordsGLBuffers();
    }


}

