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

    display(texP){
        //push transformation, material and texture to the corresponding stacks
        this.scene.pushMatrix();
        //Material
        //Texture
        //this.scene.pushTexture(this.currTexture);

        //Applies transformation
        if (this.transformation != null){
            this.scene.multMatrix(this.transformation);
        }

        //Applies Texture
        if (this.currTexture != "null" && this.currTexture != "clear"){
            this.currMaterial.setTexture(this.currTexture);
            this.currMaterial.apply();
        }
        else if (this.currTexture == "clear"){
            this.currMaterial.setTexture(null);
            this.currMaterial.apply();
        }
        else if (this.currTexture == "null"){
            this.currTexture = texP;
            this.currMaterial.setTexture(this.currTexture);
            this.currMaterial.apply();
            //
        }
        //console.log(this.currTexture);

        //Applies Material
        /*
        if (this.currMaterial != "null" && this.currMaterial != "clear"){
            //this.currMaterial.setTexture(this.currTexture);            
            console.log(this.currTexture);
            //this.currMaterial.apply();
        }
        */
        //console.log(this.scene.textures);

        for (let i = 0; i < this.primitives.length; i++){
            this.primitives[i].display();
        }

        for (let obj in this.objects){
            //Recursive loop through all objects
            this.objects[obj].display(this.currTexture);
        }

        //Texture
        //this.scene.popTexture(this.currTexture);
        //Material
        //Pops tranformation
        this.scene.popMatrix();
    }

}