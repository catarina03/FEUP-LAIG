/**
 * MyPatch class, which represents a Patch object
 */

  



class Patch extends CGFobject{//primitiva generica para produzir superficies curvas a partir do numero de pontos,partes e dos pontos de controlo

/**
   * @constructor
   * @param {XMLScene} scene           represents the CGFscene
   * @param {number}   nPartsU         
   * @param {number}   nPartsV         
   * @param {number}   nPointsU        control points U
   * @param {number}   nPointsV        control points V
   * @param {array}    controlPoints   Array with ControlPoints 
   */


    constructor(scene,npartsU,npartsV,npointsU,npointsV,controlPoints){
        super(scene);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;
        this.initBuffers();
       
    }

        initBuffers() {             //grau=nº pontos - 1
          let nurbsSurface = new CGFnurbsSurface(this.npointsU-1,this.npointsV-1,this.controlPoints);

          this.nurbsObj = new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,nurbsSurface);
          
        }

      
        display() {
          this.nurbsObj.display();
        }





        updateTexCoords(Sfactor,Tfactor) {
            this.updateTexCoordsGLBuffers();
        }
      }

    