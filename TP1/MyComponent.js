/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the component
 */

class MyComponent extends CGFobject{
    constructor(scene, id, component, loaded) {
        super(scene);

        this.id = id;

        this.component = component;

        this.children = [];
        this.primitives = [];
        this.transformation = null;

        this.currMaterial = null;
        this.currTexture = null;

        this.loaded = loaded;
        this.visited = false; //Helper to the dfs search
        
        this.currMatIndex = 0;

        /*
        this.transformation = mat4.create();
        this.materials = [];
        this.texture;
        this.length_s = null;
        this.length_t = null;
        */


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

        //Applies transformation
        if (this.transformation != null){
            //console.log(this.transformation);
            this.scene.multMatrix(this.transformation);
        }

        //Applies Texture

        //Applies Material


        
        for (let i = 0; i < this.primitives.length; i++){
            //Texture transformations

            //Calls children display method
            //console.log(this.children[i]);
            this.primitives[i].display();
        }

        for (let j = 0; j < this.children.length; j++){
            //this.children[j].display();
        }


        

        //console.log(this.children);



        //Texture
        //Material
        //Pops tranformation
        this.scene.popMatrix();
    }

}