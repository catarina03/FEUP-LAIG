/**
 * MyMenu class, which represents a the sequences of moves in a Game
 */
class MyMenu extends CGFobject {
    /**
     * @constructor
     * @param {MyBoard} scene  represents the Board of a Game
     */
    constructor(scene) {
        super(scene);

        this.yes = new MyRectangle(scene, 0, 5, 1, 6);
        this.no = new MyRectangle(scene, 2, 5, 3, 6);
        this.flag = false;

        this.value = null;


    }

    onObjectSelected(obj, id) {
        if (obj == this.yes){
            this.value = "yes";
        }
        if (obj == this.no){
            this.value = "no";
        }
    }

    resetValue(){
        this.value = null;
    }


    display(){
        this.scene.push();

        //Range 300 - 400
        if (this.flag){
            this.scene.registerForPick(300, this.yes);
            this.scene.registerForPick(301, this.yes);
            this.yes.display();
            this.no.display();
        }

        this.scene.pop();
    }
}