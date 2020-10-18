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

        this.length_s = null;
        this.length_t = null;
    };

    getID(){
        return this.id;
    }

    getChildren(){
        return this.children;
    }


    //nextMaterial()

    display(){
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

        //Applies Material
        if (this.currMaterial != "null" && this.currMaterial != "clear"){
            //this.currMaterial.setTexture(this.scene.textures[currTexture]);
            //console.log(this.currTexture);
            console.log(this.textures[this.currTexture]);
            //this.currMaterial.apply();
        }

        for (let i = 0; i < this.primitives.length; i++){
            this.primitives[i].display();
        }

        for (let obj in this.objects){
            //Recursive loop through all objects
            this.objects[obj].display();
        }

        //Texture
        //this.scene.popTexture(this.currTexture);
        //Material
        //Pops tranformation
        this.scene.popMatrix();
    }

}