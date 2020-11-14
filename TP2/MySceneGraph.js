const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var ANIMATIONS_INDEX = 6;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.root = null;
        this.nodes = [];
        this.objects = [];
        this.materials =[];
        this.textures = [];
        this.animations = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) != -1){
            if (index != ANIMATIONS_INDEX)
            this.onXMLMinorError("tag <animations> out of order");
            
            NODES_INDEX = 7;
            console.log(NODES_INDEX);
            
            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
            return error;
        }
            

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }

        this.buildFamily(this.root);
            
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.defaultView = this.reader.getString(viewsNode, 'default');
        this.views = [];

        var children = viewsNode.children;
        var nodeNames = []
        var grandchildren = [];
        var id;
        var indexFrom, indexTo, indexUp;
        var fx, fy, fz, tx, ty, tz, ux, uy, uz;
        var near, far, angle, left, right, top, bottom;

        for (var i = 0; i < children.length; i++) {
            id = this.reader.getString(children[i], 'id');

            if (id == null) {
                this.onXMLMinorError("View has a null ID");
                continue;
            }     

            grandchildren = children[i].children;

            if (children[i].nodeName == "perspective") {
                near = this.reader.getFloat(children[i], 'near');
                far = this.reader.getFloat(children[i], 'far');
                angle = this.reader.getFloat(children[i], 'angle');

                if (far == null || near == null) {
                    this.onXMLMinorError("unable to parse Camera values");
                    continue;
                }

                for (var j = 0; j < grandchildren.length; j++) {
                    nodeNames.push(grandchildren[j].nodeName);
                }

                indexFrom = nodeNames.indexOf("from");
                indexTo = nodeNames.indexOf("to");

                if (indexFrom == -1) {
                    this.onXMLMinorError("Tag <from> missing");
                    continue;
                }

                if (indexTo == -1) {
                    this.onXMLMinorError("Tag <to> missing");
                    continue;
                }

                tx = this.reader.getFloat(grandchildren[indexTo], 'x');
                ty = this.reader.getFloat(grandchildren[indexTo], 'y');
                tz = this.reader.getFloat(grandchildren[indexTo], 'z');
                fx = this.reader.getFloat(grandchildren[indexFrom], 'x');
                fy = this.reader.getFloat(grandchildren[indexFrom], 'y');
                fz = this.reader.getFloat(grandchildren[indexFrom], 'z');
                    
                if (angle == null || fx == null || fy == null || fz == null || tx == null || ty == null || tz == null) {
                    this.onXMLMinorError("can't parse perspective values");
                    continue;
                }

                var view = new CGFcamera(angle *( Math.PI / 180), near, far, [fx, fy, fz], [tx, ty, tz]);

                console.log(view);

                this.views[id] = view;

                console.log(this.views[id]);
            }

            if (children[i].nodeName == "ortho") {
                near = this.reader.getFloat(children[i], 'near');
                far = this.reader.getFloat(children[i], 'far');

                if (far == null || near == null) {
                    this.onXMLMinorError("unable to parse Camera values");
                    continue;
                }

                left = this.reader.getFloat(children[i], 'left');
                right = this.reader.getFloat(children[i], 'right');
                top = this.reader.getFloat(children[i], 'top');
                bottom = this.reader.getFloat(children[i], 'bottom');

                if (left == null || right == null || top == null || bottom == null || near == null || far == null) {
                    this.onXMLMinorError("unable to parse Ortho values");
                    continue;
                }

                for (var j = 0; j < grandchildren.length; j++) {
                    nodeNames.push(grandchildren[j].nodeName);
                }

                indexFrom = nodeNames.indexOf("from");
                indexTo = nodeNames.indexOf("to");
                indexUp = nodeNames.indexOf("up");

                if (indexFrom == -1) {
                    this.onXMLMinorError("Tag <from> missing");
                    continue;
                }

                if (indexTo == -1) {
                    this.onXMLMinorError("Tag <to> missing");
                    continue;
                }

                if (indexUp == -1) {
                    this.onXMLMinorError("Tag <up> missing");
                    continue;
                }    

                ux = this.reader.getFloat(grandchildren[indexUp], 'x');
                uy = this.reader.getFloat(grandchildren[indexUp], 'y');
                uz = this.reader.getFloat(grandchildren[indexUp], 'z');
                tx = this.reader.getFloat(grandchildren[indexTo], 'x');
                ty = this.reader.getFloat(grandchildren[indexTo], 'y');
                tz = this.reader.getFloat(grandchildren[indexTo], 'z');
                fx = this.reader.getFloat(grandchildren[indexFrom], 'x');
                fy = this.reader.getFloat(grandchildren[indexFrom], 'y');
                fz = this.reader.getFloat(grandchildren[indexFrom], 'z');

                if (fx == null || fy == null || fz == null || tx == null || ty == null || tz == null || ux == null || uy == null || uz == null ) {
                    this.onXMLMinorError("unable to ortho values");
                    continue;
                }

                var orthocam = new CGFcameraOrtho(left, right, bottom, top, near, far, [fx, fy, fz], [tx, ty, tz], [ux, uy, uz]);
                this.views[id] = orthocam;
            }
            nodeNames = [];
        }
        this.log("Parsed views");
        console.log(this.views);
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {
            var id = this.reader.getString(children[i], 'id');
            var path = this.reader.getString(children[i], 'path');

            if (typeof this.textures[id] != 'undefined') //ver se a textura ja existe
            {
                this.onXMLError("texture: texture with id " + id + " already exists.")
            }

            if (path == null)  //checks if path reading was succesfull
            {
                return "Not found file " + path + " of " + "texture with ID" + id;
            }

            this.textures[id] = new CGFtexture(this.scene, path);  //creates new texture
            this.log("Parsed texture " + id);
        }

        return null;
    }


    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        var grandChildren = [];
        var nodeNames = [];

        var numMaterials = 0;

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            var global = [];
            var attributeNames=[];
            var attributeTypes=[];

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else{
                attributeNames.push(...["emissive","ambient","diffuse","specular"]);
                attributeTypes.push(...["color","color","color","color"]);
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
                
            if (materialID == null){
                this.onXMLMinorError("no ID defined for material");
                continue;
            }
                
            if(materialID==""){
                this.onXMLMinorError("ignored material in the position"+(i+1)+ ":ID is missing");
                continue;
            }
                
            // Checks for repeated IDs.
            if (this.materials[materialID] != null){
                this.onXMLMinorError("A material with the ID = " + materialID + " already exists");
                continue; 
            }

            //Continue here
            var materialSpecs = children[i].children;
            var nodeNames = [];

            for (var j = 0; j < materialSpecs.length; j++)
                nodeNames.push(materialSpecs[j].nodeName);

            // Determines the values for each field.
            // Shininess.
            let shininess;
            let shininessIndex = nodeNames.indexOf("shininess");
            if (shininessIndex == -1){
                this.onXMLMinorError("no shininess value defined for material with ID = " + materialID);
                shininess = 20; 
            }
            else{
                shininess = this.reader.getFloat(materialSpecs[shininessIndex], 'value');
            }

            if(!(shininess != null && !isNaN(shininess && shininess > 0))){
                this.onXMLMinorError("unable to parse shininess for the material with ID = "+ materialID);
                shininess = 20;
            }
        
            global.push(shininess);
            grandChildren=children[i].children;

            nodeNames=[];

            for(var j=0; j< grandChildren.length;j++){
                nodeNames.push(grandChildren[j].nodeName);
            }

            for(var j=0;j< attributeNames.length;j++){
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);
                
                if(attributeIndex != -1) {
                    var aux=this.parseColor(grandChildren[attributeIndex],"attribute \"" + attributeNames[j] + "\" of the Material with ID = " + materialID);
                    if(!Array.isArray(aux)){
                        this.onXMLMinorError("error parsing " + attributeNames[j] + " of material " + materialID); 
                        aux = [0.1, 0.1, 0.1, 1];  //default 
                    }
                    global.push(aux);
                }
                else{
                    this.onXMLMinorError("material"+ attributeNames[j]+ "undefined for id =" + materialID);
                    global.push([0.1, 0.1, 0.1, 1]);  //default
                } 
            }

            var provMaterial=new CGFappearance(this.scene);
            provMaterial.setShininess(global[0]);
            provMaterial.setEmission(...global[1]);
            provMaterial.setAmbient(...global[2]);
            provMaterial.setDiffuse(...global[3]);
            provMaterial.setSpecular(...global[4]);
            provMaterial.setTextureWrap('REPEAT','REPEAT');

            this.materials[materialID]=provMaterial;
            numMaterials++;
        }

        if(numMaterials==0)
            return "there must be at least one material defined";
            
        this.log("Parsed materials");

        return null;
    }


    parseAnimations(animationsNode){
        let children = animationsNode.children; //<animation>

        for (let i = 0; i < children.length; i++){

            if (children[i].nodeName != "animation"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //Parses ID
            let animationID = this.reader.getString(children[i], 'id');

            if (animationID == null) {
                this.onXMLMinorError("animation has a null ID");
                continue;
            } 

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            let keyframeArray = [];

            let keyframes = children[i].children;

            //Parsing each keyframe
            for (let j = 0; j < keyframes.length; j++){
                //Checking tag
                if (keyframes[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
                }
    
                //Gets instant
                let keyframeInstant = this.reader.getFloat(keyframes[j], "instant");
    
                //Gets children which are the transformations
                let keyframeTransformations = keyframes[j].children;

                console.log("-----------------")
                console.log(keyframes[j])
                console.log("-----------------")

                let translationVec = vec3.fromValues(0, 0, 0);
                let rotationXVec = vec3.fromValues(0, 0, 0);
                let rotationYVec = vec3.fromValues(0, 0, 0);
                let rotationZVec = vec3.fromValues(0, 0, 0);
                let scaleVec = vec3.fromValues(0, 0, 0);
                let angle, axis;

                for (let k = 0; k < keyframeTransformations.length; k++){

                    console.log("-----------------")
                    console.log(keyframeTransformations[k])
                    console.log("-----------------")

                    switch (keyframeTransformations[k].nodeName){
                        case "translation":
                            let x = this.reader.getFloat(keyframeTransformations[k], "x");
                            let y = this.reader.getFloat(keyframeTransformations[k], "y");
                            let z = this.reader.getFloat(keyframeTransformations[k], "z");

                            let intermidiateTranslation = vec3.fromValues(x, y, z);
                            vec3.add(translationVec, translationVec, intermidiateTranslation);
                            break;

                        case "rotation":
                            if ((axis = this.reader.getFloat(keyframeTransformations[k], "axis")) == "x"){
                                angle = this.reader.getFloat(keyframeTransformations[k], "angle");

                                let intermidiateRotation = vec3.fromValues(angle, 0, 0);
                                vec3.add(rotationXVec, rotationXVec, intermidiateRotation);
                            }
                            else if ((axis = this.reader.getFloat(keyframeTransformations[k], "axis")) == "y"){
                                angle = this.reader.getFloat(keyframeTransformations[k], "angle");

                                let intermidiateRotation = vec3.fromValues(0, angle, 0);
                                vec3.add(rotationYVec, rotationYVec, intermidiateRotation);
                            }
                            else if ((axis = this.reader.getFloat(keyframeTransformations[k], "axis")) == "z"){
                                angle = this.reader.getFloat(keyframeTransformations[k], "angle");

                                let intermidiateRotation = vec3.fromValues(0, 0, angle);
                                vec3.add(rotationZVec, rotationZVec, intermidiateRotation);
                            }
                            break;

                        case "scale":
                            let sx = this.reader.getFloat(keyframeTransformations[k], "sx");    
                            let sy = this.reader.getFloat(keyframeTransformations[k], "sy");
                            let sz = this.reader.getFloat(keyframeTransformations[k], "sz");

                            let intermidiateScale = vec3.fromValues(sx, sy, sz);
                            vec3.add(scaleVec, scaleVec, intermidiateScale);
                            break;

                        default:
                            this.onXMLMinorError("Unkown keyframe transformation tag");
                            break;
                    }

                    console.log(translationVec)

                }

                console.log(translationVec)
                
                console.log("TRANSLATION VEC ---------------------------")

                let allRotation = vec3.fromValues(rotationXVec, rotationYVec, rotationZVec);

                //let newKeyframe = new MyKeyframe(keyframeInstant, vec3.fromValues(translationVec, allRotation, scaleVec))
                let newKeyframe = new MyKeyframe(keyframeInstant, [translationVec, allRotation, scaleVec])
                keyframeArray.push(newKeyframe)
                console.log(keyframeArray)

            }

            let animation = new MyKeyframeAnimation(this.scene, keyframeArray[0].instant, keyframeArray[keyframeArray.length-1].instant);
            animation.keyframes = keyframeArray;

            //console.log(animation);
            //console.log(keyframeArray);


    
            this.animations[animationID] = animation;

            //add all keyframes to make an animation
            
        }

    }


    /**
    * Parses the <nodes> block.
    * @param {nodes block element} nodesNode
    */
    parseNodes(nodesNode) {
        var children = nodesNode.children; //<node>
        var grandChildren = [];  //<material>, <texture>, <transformations>, <descendants>
        var grandgrandChildren = [];  //<noderef>, <leaf>
        var nodeNames = [];

        // Any number of nodes.
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            var newComponent = new MyComponent(this.scene, nodeID, "component");

            grandChildren = children[i].children; 

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var animationsIndex = nodeNames.indexOf("animationref");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var error;

            this.onXMLMinorError("To do: Parse nodes.");

            // Parses transformations whithin component
            if ((transformationsIndex = nodeNames.indexOf("transformations")) == -1)
                return "tag <transformations> missing";
            else {
                var transformationID = this.reader.getString(children[i], 'id');  //ID of the associated node
                var transformationsChildren = grandChildren[transformationsIndex].children;
                var transformationMatrix = mat4.create();

                for (let j = 0; j < transformationsChildren.length; j++){
                    switch (transformationsChildren[j].nodeName){
                        case "translation":
                            var translationCoords = this.parseCoordinates3D(transformationsChildren[j], transformationID);
                            transformationMatrix = mat4.translate(transformationMatrix, transformationMatrix, translationCoords);
                            break;

                        case "rotation":
                            var rotationAxis = this.reader.getString(transformationsChildren[j], "axis");
                            var rotationAngle = this.reader.getFloat(transformationsChildren[j], "angle");
                            var rotation;

                            // Validates axis and angle
                            if (isNaN(rotationAngle))
                                return "unable to parse angle component (NaN) on tag <rotation> from the <node> node with index " + i;

                            if (rotationAngle == null || rotationAxis == null)
                                return "unable to parse axis and angle components (null) on tag <rotation> from the <node> node with index " + i;

                            if (rotationAxis != "x" && rotationAxis != "y" && rotationAxis != "z")
                                return "unable to parse axis component (should be x, y or z) on tag <rotate> from the <node> node with index " + i;

                            if (rotationAxis == "x") rotation = [1, 0, 0];
                            else if (rotationAxis == "y") rotation = [0, 1, 0];
                            else if (rotationAxis == "z") rotation = [0, 0, 1];

                            transformationMatrix = mat4.rotate(transformationMatrix, transformationMatrix, rotationAngle * DEGREE_TO_RAD, rotation);
                            break;

                        case "scale":
                            var scaleCoords = this.parseScaleCoords(transformationsChildren[j], transformationID);
                            mat4.scale(transformationMatrix, transformationMatrix, scaleCoords);
                            break;
                    }                    
                }                
            }

            let animation = null;
            if ((animationsIndex = nodeNames.indexOf("animationref")) != -1){               
                //Parses animantion within component
                var animationID = this.reader.getString(grandChildren[animationsIndex], 'id');
    
                // Validates id
                if (animationID == null)
                    return "id is not a valid animation (null) on component " + nodeID;

    
                if (this.animations[animationID] == null)
                    return animationID + " is not a valid animation on component " + nodeID;

                animation = this.animations[animationID];
            }



            // Material
            // Retrieves material ID
            if ((materialIndex = nodeNames.indexOf("material")) == -1)
                return "tag <material> missing";
            else {
                var materialID = this.reader.getString(grandChildren[materialIndex], 'id');
                var componentMaterial;

                if (materialID == null)
                    return "unable to parse material ID (node ID = " + nodeID + ")";

                if (materialID != "null" && this.materials[materialID] == null)
                    return "ID does not correspond to a valid material (node ID = " + nodeID + ")";
                
                if (materialID == "null"){
                    componentMaterial = "null";
                }
                else if (materialID == "clear"){
                    componentMaterial = "clear";
                }
                else{
                    componentMaterial = this.materials[materialID];
                }

            }

            // Texture
            if ((textureIndex = nodeNames.indexOf("texture")) == -1)
                return "tag <texture> missing";
            else {
                var texStruct = this.parseNodeTexture(nodeID, grandChildren[textureIndex]);
            }

            // Descendants
            if ((descendantsIndex = nodeNames.indexOf("descendants")) == -1)
                return "tag <descendants> missing";
            else {
                grandgrandChildren = grandChildren[descendantsIndex].children;

                var leaves = [];
                var noderefs = [];

                for (var k = 0; k < grandgrandChildren.length; k++) {
                    if (grandgrandChildren[k].nodeName == "leaf"){  //Parse leaf
                        if ((error = this.parseLeaf(grandgrandChildren[k], leaves) != null))
                        return error;
                    } 
                    else if (grandgrandChildren[k].nodeName == "noderef"){  //Parse node
                        noderefs.push(grandgrandChildren[k]);
                    }
                }
            }

            if (texStruct.id == "null"){
                newComponent.currTexture = "null";
            }
            else if (texStruct.id == "clear"){
                newComponent.currTexture = "clear";
            }
            else{
                newComponent.currTexture = this.textures[texStruct.id];
            }

            newComponent.transformation = transformationMatrix;
            newComponent.afs = texStruct.afs;
            newComponent.aft = texStruct.aft;
            newComponent.primitives = leaves;
            newComponent.children = noderefs;
            newComponent.currMaterial = componentMaterial;
            newComponent.animation = animation;

            this.nodes[nodeID] = children[i];
            this.objects[nodeID] = newComponent;

            if (nodeID == "bola1"){
                console.log(newComponent)
            }

            console.log(this.animations);

            if (nodeID == this.idRoot){
                this.root = newComponent;
            }
        }
    }

    /**
     * Parses the <texture> block in each <node> block
     * @param {id of the node <node> being parsed} componentID 
     * @param {node texture block element} textureNode 
     */
    parseNodeTexture(componentID, textureNode) {
        var textureID = this.reader.getString(textureNode, 'id');
        var afs = 1;
        var aft = 1;
        
        var texStruct = {
            id: textureID,
            af_s: afs,
            af_t: aft
        };

        if (this.textures[textureID] == null && !(textureID == "null") && !(textureID == "clear"))
            this.onXMLMinorError(textureID + " is not valid on textures of component " + componentID);
            
        var amplification = textureNode.children;
        if (amplification.length > 0){
            afs = this.reader.getFloat(amplification[0], 'afs');
            aft = this.reader.getFloat(amplification[0], 'aft');

            //setting afs and aft 
            if (afs != null) {
                if (isNaN(afs)){
                    this.onXMLMinorError("afs isn't a number in texture " + textureID + " of component " + componentID);
                    afs = 1;  //default
                }
                if (afs <= 0){
                    this.onXMLMinorError("afs is can't be negative or 0 in texture " + textureID + " of component " + componentID);
                    afs = 1;  //default
                }
            }
            else{
                afs = 1;  //default
            }

            if (aft != null) {
                if (isNaN(aft)){
                    this.onXMLMinorError("aft isn't a number in texture " + textureID + " of component " + componentID);
                    aft = 1;  //default
                }
                if (aft <= 0){
                    this.onXMLMinorError("aft is can't be negative or 0 in texture " + textureID + " of component " + componentID);
                    aft = 1;  //default
                }
            }
            else{
                aft = 1;  //default
            }
        }

        return texStruct
    }


    /**
     * Builds the dependencies between nodes (parent/child nodes) recursively
     * @param {MyComponent object whose family will be built} object 
     */
    buildFamily(object){
        var node = this.nodes[object.id];
        var children = node.children; //<material>, <texture>, <transformations>, <descendants>
        var grandChildren = []; //<noderef> or <leaf>

        for (let i = 0; i < children.length; i++){

            // Descendants
            if (children[i].nodeName == "descendants") {
                grandChildren = children[i].children;
                for (let j = 0; j < grandChildren.length; j++){
                    if (grandChildren[j].nodeName == "noderef"){ 
                        if (this.objects[object.id].objects[grandChildren[j].id] == null)
                            this.objects[object.id].objects[grandChildren[j].id] = this.objects[grandChildren[j].id];

                        this.buildFamily(this.objects[grandChildren[j].id]);
                    }
                }
            }
        }
    }

    
    /**
     * Parses each <leaf> node
     * @param {leaf block element} leaf 
     * @param {vector of primitives where the leaf will be added} vector 
     */
    parseLeaf(leaf, vector){
        var leafType = this.reader.getString(leaf, 'type');

        if(leafType == "rectangle"){
            let x1 = this.reader.getFloat(leaf,'x1');
            if (!(x1 != null && !isNaN(x1)))
                return "unable to parse x1 of rectangle";

            let y1 = this.reader.getFloat(leaf,'y1');
            if (!(y1 != null && !isNaN(y1)))
                return "unable to parse y1 of rectangle";

            let x2 = this.reader.getFloat(leaf,'x2');
            if (!(x2 != null && !isNaN(x2)))
                return "unable to parse x2 of rectangle";

            let y2 = this.reader.getFloat(leaf,'y2');
            if (!(y2 != null && !isNaN(y2)))
                return "unable to parse y2 of rectangle";

            vector.push(new MyRectangle(this.scene, x1, y1, x2, y2));
        }
        else if (leafType == "triangle"){
            let x1 = this.reader.getFloat(leaf,'x1');
            if (!(x1 != null && !isNaN(x1)))
                return "unable to parse x1 of triangle";
            let y1 = this.reader.getFloat(leaf,'y1');
            if (!(y1 != null && !isNaN(y1)))
                return "unable to parse y1 of triangle";
            let x2 = this.reader.getFloat(leaf,'x2');            
            if (!(x2 != null && !isNaN(x2)))
                return "unable to parse x2 of triangle";
            let y2 = this.reader.getFloat(leaf,'y2');            
            if (!(y2 != null && !isNaN(y2)))
                return "unable to parse y2 of triangle";
            let x3 = this.reader.getFloat(leaf,'x3');            
            if (!(x3 != null && !isNaN(x3)))
                return "unable to parse x3 of triangle";
            let y3 = this.reader.getFloat(leaf,'y3');            
            if (!(y3 != null && !isNaN(y3)))
                return "unable to parse y3 of triangle";

            vector.push(new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3));
        }
        else if (leafType == "cylinder"){
            let height = this.reader.getFloat(leaf,'height');
            if (!(height != null && !isNaN(height)))
                return "unable to parse x1 of cylinder";
            let topRadius = this.reader.getFloat(leaf,'topRadius');
            if (!(topRadius != null && !isNaN(topRadius)))
                return "unable to parse x1 of cylinder";
            let bottomRadius = this.reader.getFloat(leaf,'bottomRadius');
            if (!(bottomRadius != null && !isNaN(bottomRadius)))
                return "unable to parse x1 of cylinder";
            let stacks = this.reader.getFloat(leaf,'stacks');
            if (!(stacks != null && !isNaN(stacks)))
                return "unable to parse x1 of cylinder";
            let slices = this.reader.getFloat(leaf,'slices');
            if (!(slices != null && !isNaN(slices)))
                return "unable to parse x1 of cylinder";

            vector.push(new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks));
        }
        else if (leafType == "sphere"){
            let radius = this.reader.getFloat(leaf,'radius');
            if (!(radius != null && !isNaN(radius)))
                return "unable to parse radius of sphere";
            let stacks = this.reader.getFloat(leaf,'stacks');
            if (!(stacks != null && !isNaN(stacks)))
                return "unable to parse stacks of sphere";
            let slices = this.reader.getFloat(leaf,'slices');
            if (!(slices != null && !isNaN(slices)))
                return "unable to parse slices of sphere";

            vector.push(new MySphere(this.scene, radius, slices, stacks));
        }
        else if (leafType == "torus"){
            let inner = this.reader.getFloat(leaf,'inner');
            if (!(inner != null && !isNaN(inner)))
                return "unable to parse inner of torus";
            let outer = this.reader.getFloat(leaf,'outer');
            if (!(outer != null && !isNaN(outer)))
                return "unable to parse outer of torus";
            let slices = this.reader.getFloat(leaf,'slices');
            if (!(slices != null && !isNaN(slices)))
                return "unable to parse slices of torus";
            let loops = this.reader.getFloat(leaf,'loops');
            if (!(loops != null && !isNaN(loops)))
                return "unable to parse loops of torus";

            vector.push(new MyTorus(this.scene, inner, outer, slices, loops));
        }
        
    }

    /**
     * Parses the boolean value of the parameter "name" in the node "node"
     * @param {block element} node 
     * @param {parameter to be parsed} name 
     * @param {message to be displayed in case of error} messageError 
     */
    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
          this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
          return true;
        }
        return boolVal;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }


    /**
     * Parse the scale coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseScaleCoords(node, messageError) {
        var scaleCoords = [];

        // x
        var x = this.reader.getFloat(node, 'sx');
        if (!(x != null && !isNaN(x)))
            return "unable to parse sx-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'sy');
        if (!(y != null && !isNaN(y)))
            return "unable to parse sy-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'sz');
        if (!(z != null && !isNaN(z)))
            return "unable to parse sz-coordinate of the " + messageError;

        scaleCoords.push(...[x, y, z]);

        return scaleCoords;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }


    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {        
        this.root.display();
    }
}