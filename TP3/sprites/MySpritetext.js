class MySpriteText extends MySpriteSheet{
    /**
     * Constructor
     * @param {*} scene - refers to MyScene object
     * @param {*} texture - texture to be used as spritesheet
     * @param {*} sizeM - number of columns
     * @param {*} sizeN - number of rows
     * @param {*} text - text to be written
     */
    constructor(scene, texture, sizeM, sizeN, text){
        super(scene, texture, sizeM, sizeN);
        
        this.text = text;
        this.sideSize = 3;

        this.characterMap = {'0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 
        '!':10, '?':11, '@':12, '#':13, '$':14, '%':15, '&':16, '\'':17, '"':18, '(':19, 
        ')':20, '+':21, '-':22, '=':23, ',':24, '.':25, 'A':26, 'B':27, 'C':28, 'D':29, 
        'E':30, 'F':31, 'G':32, 'H':33, 'I':34, 'J':35, 'K':36, 'L':37, 'M':38, 'N':39, 
        'O':40, 'P':41, 'Q':42, 'R':43, 'S':44, 'T':45, 'U':46, 'V':47, 'W':48, 'X':49, 
        'Y':50, 'Z':51, 'a':52, 'b':53, 'c':54, 'd':55, 'e':56, 'f':57, 'g':58, 'h':59, 
        'i':60, 'j':61, 'k':62, 'l':63, 'm':64, 'n':65, 'o':66, 'p':67, 'q':68, 'r':69, 
        's':70, 't':71, 'u':72, 'v':73, 'w':74, 'x':75, 'y':76, 'z':77, '<':78, '>':79, 
        '[':80, ']':81, '{':82, '}':83, '\\':84, '/':85, '`':86, 'á':87, 'ã':88, 'à':89, 
        'é':90, 'ë':91, 'è':92, 'í':93, 'ó':94, 'õ':95, 'ú':96, 'ù':97, 'ü':98, 'ñ':99, 
        'Ç':100, 'ç':101, '¡':102, '¿':103, '©':104, '®':105, '™':106, '·':107, '§':108, '†':109, 
        '‡':110, '‐':111, '‒':112, '¶':113, '÷':114, '°':115, '¤':116, '¢':117, 'ß':118, 'Þ':119, 
        ':':120, ';':121, '^':122, '~':123, '♂':124, '♀':125, '♥':126, '♪':127, '♫':128, '☼':129};

        this.baseGeometry = new MyRectangle(this.scene, -this.sideSize/2, -this.sideSize/2, this.sideSize/2, this.sideSize/2)
        this.scene.fontShader.setUniformsValues({textLength: this.text.length});
    }

    
    getCharacterPosition(character){
        return this.characterMap[character]
    }


    /**
     * Displays spritetext
     */
    display(){
        this.scene.gl.enable(this.scene.gl.BLEND);    // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);    // defines the blending function

        this.scene.setActiveShaderSimple(this.shader); // activate selected shader
        
        for (let i = 0; i < this.text.length; i++){
            let position = this.getCharacterPosition(this.text[i])
            let column = position % this.sizeM
            let row = Math.floor(position / this.sizeM)

            this.activateCellMN(row, column, this.sideSize)
            
            this.scene.pushMatrix();

            this.appearance.setTexture(this.texture);

            this.scene.translate(-this.text.length*this.sideSize/2 + i*this.sideSize + this.sideSize/2, 0, 0);

            this.appearance.apply();
            this.baseGeometry.display();

            this.scene.popMatrix();
        }
        
        this.scene.setActiveShaderSimple(this.scene.defaultShader);

        this.scene.gl.disable(this.scene.gl.BLEND);  
    }

    
}