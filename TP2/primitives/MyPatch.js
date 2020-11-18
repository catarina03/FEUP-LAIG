class MyPatch extends CGFobject{//primitiva generica para produzir superficies curvas a partir do numero de pontos,partes e dos pontos de controlo



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

          this.nurbsObj = new CGFnurbsObject(this.scene,this.npointsU,this.npointsV,nurbsSurface);
          
        }

      
        display() {
          this.nurbsObj.display();
        }





        updateTexCoords(Sfactor,Tfactor) {
            this.updateTexCoordsGLBuffers();
        }
      }

    