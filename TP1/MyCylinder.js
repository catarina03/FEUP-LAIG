


 class MyCylinder extends CGFobject{
    constructor(scene, bottom_radius, top_radius, height, slices, stacks) {
        super(scene);
        
        this.top_cover = new MyCircle(scene, top_radius, slices);
        this.bottom_cover = new MyCircle(scene, bottom_radius, slices);
        this.height = height;
        this.cylinder_surface = new MyCylinderSurface(scene, bottom_radius, top_radius, height, slices, stacks);
    };

      display(){

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.top_cover.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.bottom_cover.display();
        this.scene.popMatrix();

        this.cylinder_surface.display();
    };


    updateTexCoords(Sfactor,Tfactor){

      this.cylinder_surface.updateTexCoords(1,1);
    }


    }

 

 class MyCircle extends CGFobject{
    constructor(scene, radius, slices) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.initBuffers();
    };

    initBuffers(){

        var angle = 2.0 * Math.PI / this.slices;

        this.vertices = [0,0,0];
        this.indices = [];
        this.normals = [0,0,1];

        var curr_angle = 0;
        var index_counter = 0;
        var x0, x1, y0, y1;

        for(var i = 0; i < this.slices; i++){

            x0 = Math.cos(curr_angle) * this.radius;
            y0 = Math.sin(curr_angle) * this.radius;

            curr_angle += angle; 

            x1 = Math.cos(curr_angle) * this.radius;
            y1 = Math.sin(curr_angle) * this.radius;

            this.vertices=[
                 x0,y0,0,
                 x1,y1,0
             ]
            
        

            this.indices.push(0, index_counter+1, index_counter+2);

            index_counter += 2;

            this.normals.push(0,0,1);
            this.normals.push(0,0,1);

 }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
    
}



 class MyCylinderSurface extends CGFobject{
    constructor(scene, bottom_radius, top_radius, height, slices, stacks) {
        super(scene);
        this.bottom_radius=bottom_radius;
        this.top_radius=top_radius
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers(){

        var angle = 2.0 * Math.PI / this.slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];


        for (var stack_c = 0; stack_c <= this.stacks; stack_c++) {
            var curr_angle = 0.0;
            var curr_radius = (this.top_rad - this.base_rad) * (stack_c / this.stacks) + this.base_rad;
            var z0 = this.height * stack_c / this.stacks;
            for (slice_c = 0; slice_c <= this.slices; slice_c++) {
                var x = Math.cos(curr_angle) * curr_radius;
                var y = Math.sin(curr_angle) * curr_radius;
                this.vertices.push(x, y, z0);
                this.normals.push(x, y, 0);
                curr_angle += angle;
            }
        }
    
        for (var stack_c = 0; stack_c < this.stacks; stack_c++) {
            for (var slice_c = 0; slice_c < this.slices; slice_c++) {
                var index1 = slice_c + stack_c * (this.slices + 1);
                var index2 = slice_c + stack_c * (this.slices + 1) + 1;
                var index3 = slice_c + (stack_c + 1) * (this.slices + 1);
                var index4 = slice_c + (stack_c + 1) * (this.slices + 1) + 1;
                this.indices.push(index4, index3, index1);
                this.indices.push(index1, index2, index4);
            }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    };

    

        
   updateTexCoords(Sfactor,Tfactor){

    
    this.texCoords = [];

        for (var stack_c = 0; stack_c <= this.stacks; stack_c++) {
            var v = 1 - (stack_c / this.stacks);
            for (var slice_c = 0; slice_c <= this.slices; slice_c++) {
                var u = 1 - (slice_c / this.slices);
                this.texCoords.push(u, v);
           
          }

        }

       
   

    }

 }