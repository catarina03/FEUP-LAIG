/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the component
 */

class MyComponent extends CGFobject{
    constructor(scene, id, component) {
        super(scene);

        this.id = id;

        this.component = component;

        this.children = [];
        this.primitives = [];
        this.objects = [];
        this.transformation = null;

        //this.currMaterial = null;
        this.currMaterial = new CGFappearance(this.scene);
        this.currTexture = null;
        
        this.currMatIndex = 0;

        this.afs = null;
        this.aft = null;
    };

    getID(){
        return this.id;
    }

    getChildren(){
        return this.children;
    }


    //nextMaterial()

    display(parentMaterial, parentTexture){
        //push transformation, material and texture to the corresponding stacks
        this.scene.pushMatrix();
        //Material
        //this.currMaterial=this.scene.pushMaterial(this.component.materials[this.currMatIndex]);
        //Texture
        //this.scene.pushTexture(this.currTexture);

        //Applies transformation
        if (this.transformation != null){
            this.scene.multMatrix(this.transformation);
        }

        //Applies Material and Texture

        if(this.currMaterial == "null") { 
            this.currMaterial = parentMaterial;

            if (this.currTexture != "null" && this.currTexture != "clear"){
                this.currMaterial.setTexture(this.currTexture);
            }
            else if (this.currTexture == "clear"){
                this.currMaterial.setTexture(null);
            }
            else if (this.currTexture == "null"){
                this.currTexture = parentTexture;
                this.currMaterial.setTexture(this.currTexture);
            }       

            this.currMaterial.apply();                                     
        }  
        else {
            if (this.currTexture != "null" && this.currTexture != "clear"){
                this.currMaterial.setTexture(this.currTexture);
            }
            else if (this.currTexture == "clear"){
                this.currMaterial.setTexture(null);
            }
            else if (this.currTexture == "null"){
                this.currTexture = parentTexture;
                this.currMaterial.setTexture(this.currTexture);
            }   

            this.currMaterial.apply();
        }

        //console.log(this.currTexture);

        for (let i = 0; i < this.primitives.length; i++){
            this.primitives[i].display();
        }

        for (let obj in this.objects){
            //Recursive loop through all objects
            this.objects[obj].display(this.currMaterial, this.currTexture);
        }

        //Texture
        //this.scene.popTexture(this.currTexture);
        //Material
        //Pops tranformation
        //this.scene.popMaterial();
        this.scene.popMatrix();
    }

}