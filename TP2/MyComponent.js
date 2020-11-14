/**
 * MyComponent
 */
class MyComponent extends CGFobject{
    /**
     * constructor
     * @param scene - Reference to MyScene object
     * @param id - ID of the component
     */
    constructor(scene, id, component) {
        super(scene);

        this.id = id;

        this.component = component;

        this.primitives = [];
        this.objects = [];
        this.transformation = null;
        this.animation = null;

        this.currMaterial = null;
        this.currTexture = null;

        this.afs = null;
        this.aft = null;
    };

    getID(){
        return this.id;
    }

    getChildren(){
        return this.children;
    }

    updateAnimation(time){
        if (this.animation != null){
            if (this.animation.finished){
                return;
            }
            else{
                this.animation.update(time);
            }
        }

        //console.log("ANIMATION");
        //console.log(this.id);
        //console.log(this.objects);

        for (let obj in this.objects){
            this.objects[obj].updateAnimation(time);
        }

    }

    /**
     * Displays objects recursively
     * @param parentMaterial - Material to be inherited
     * @param parentTexture - Texture to be inherited
     */
    display(parentMaterial, parentTexture){
        this.scene.pushMatrix();

        let newMaterial;
        let newTexture;

        //Applies transformation
        if (this.transformation != null){
            this.scene.multMatrix(this.transformation);
        }


        //Applies Material and Texture
        if(this.currMaterial == "null") { 
            newMaterial = parentMaterial;

            if (this.currTexture != "null" && this.currTexture != "clear"){
                newMaterial.setTexture(this.currTexture);
                newTexture = this.currTexture;
            }
            else if (this.currTexture == "clear"){
                newMaterial.setTexture(null);
                newTexture = "clear";
            }
            else if (this.currTexture == "null"){
                if (parentTexture instanceof CGFtexture){
                    newMaterial.setTexture(parentTexture);
                    newTexture = parentTexture;
                }
                else{
                    newMaterial.setTexture(null);
                    newTexture = "null";
                }
            }
            else{
                newMaterial.setTexture(null);
            }

            newMaterial.apply();                                     
        }  
        else {
            newMaterial = this.currMaterial;

            if (this.currTexture != "null" && this.currTexture != "clear"){
                this.currMaterial.setTexture(this.currTexture);
                newTexture = this.currTexture;
            }
            else if (this.currTexture == "clear"){
                this.currMaterial.setTexture(null);
                newTexture = "clear";
            }
            else if (this.currTexture == "null"){
                if (parentTexture instanceof CGFtexture){
                    newMaterial.setTexture(parentTexture);
                    newTexture = parentTexture;
                }
                else{
                    newMaterial.setTexture(null);
                    newTexture = "null";
                }
            }   
            else{
                newMaterial.setTexture(null);
            }

            this.currMaterial.apply();
        }

        if (this.animation != null){
            console.log(this.animation);
            this.animation.apply();
        }

        for (let i = 0; i < this.primitives.length; i++){
            this.primitives[i].display();
        }

        for (let obj in this.objects){
            //Recursive loop through all objects
            this.objects[obj].display(newMaterial, newTexture);
        }

        this.scene.popMatrix();
    }

}