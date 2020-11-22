class MyPlane extends CGFobject {
     
    /**
     * @constructor
     * @param {XMLScene} scene    represents the CGFscene
     * @param {number}   nrDivsU  divisions in U          
     * @param {number}   nrDivsV  divisions in V          
     */


    constructor(scene,npartsU,npartsV) {
		super(scene);
        this.scene = scene;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.initBuffers();
    }
    

    initBuffers() {
		let controlPoints = [
				// U = 0
                [ // V = 0..1;
                     [-0.5, 0.0, 0.5, 1 ], //dimensao 1x1 no plano XZ
                     [-0.5, 0.0, -0.5, 1 ]
                    
                ],
                // U = 1
                [ // V = 0..1
                     [ 0.5, 0.0, 0.5, 1 ],//dimensao 1x1 no plano XZ
                     [ 0.5, 0.0, -0.5, 1 ]							 
                ]
            
        ];
        let nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);

        this.nurbsObj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );
    };



    display() {
        this.nurbsObj.display();
    }




    updateTexCoords(Sfactor,Tfactor) {
		this.updateTexCoordsGLBuffers();
	}


}
