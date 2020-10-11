const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
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
        this.primitives = []; //just for testing
        this.myNodes = []; //more testing

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
        this.onXMLMinorError("To do: Parse views and create cameras.");
        return null;
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
        this.onXMLMinorError("To do: Parse textures.");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Continue here
            this.onXMLMinorError("To do: Parse materials.");
        }

        //this.log("Parsed materials");
        return null;
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
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var error;

            this.onXMLMinorError("To do: Parse nodes.");

            // Transformations
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
                            var rotationAngle = this.reader.getString(transformationsChildren[j], "angle");
                            var rotation;

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

            // Material
            if ((materialIndex = nodeNames.indexOf("material")) == -1)
                return "tag <material> missing";
            else {
                //TO DO
            }

            // Texture
            if ((textureIndex = nodeNames.indexOf("texture")) == -1)
                return "tag <texture> missing";
            else {
                //TO DO
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
                        /*
                        if (this.nodes[this.reader.getString(grandgrandChildren[k], "id")] != null){
                            newComponent.children.push(new MyComponent(this.scene, this.reader.getString(grandgrandChildren[k], "id"), this.nodes[this.reader.getString(grandgrandChildren[k], "id")], true));
                        }
                        else{
                            console.log("To do: descendentes ainda não declarados");
                            newComponent.children.push(new MyComponent(this.scene, this.reader.getString(grandgrandChildren[k], "id"), this.nodes[this.reader.getString(grandgrandChildren[k], "id")], false));
                        }
                        */
                        noderefs.push(grandgrandChildren[k]);
                    }
                }
            }

            newComponent.transformation = transformationMatrix;
            newComponent.primitives = leaves;
            newComponent.children = noderefs;
            
            this.nodes[nodeID] = children[i];
            this.objects[nodeID] = newComponent;

            if (nodeID == this.idRoot){
                this.root = newComponent;
            }
            
        }

    }

    buildFamily(object){
        var node = this.nodes[object.id];
        var children = node.children; //nodes: <material>, <texture>, <transformations>, <descendants>
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


    parseLeaf(leaf, vector){
        var leafType = this.reader.getString(leaf, 'type');

        if(leafType == "rectangle"){
            let x1 = this.reader.getFloat(leaf,'x1');
            let y1 = this.reader.getFloat(leaf,'y1');
            let x2 = this.reader.getFloat(leaf,'x2');
            let y2 = this.reader.getFloat(leaf,'y2');

            vector.push(new MyRectangle(this.scene, x1, x2, y1, y2));
        }
        else if (leafType == "triangle"){
            let x1 = this.reader.getFloat(leaf,'x1');
            let y1 = this.reader.getFloat(leaf,'y1');
            let z1 = this.reader.getFloat(leaf,'z1');
            let x2 = this.reader.getFloat(leaf,'x2');
            let y2 = this.reader.getFloat(leaf,'y2');
            let z2 = this.reader.getFloat(leaf,'z2');
            let x3 = this.reader.getFloat(leaf,'x3');
            let y3 = this.reader.getFloat(leaf,'y3');
            let z3 = this.reader.getFloat(leaf,'z3');

            vector.push(new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3));
        }
        else if (leafType == "cylinder"){
            let height = this.reader.getFloat(leaf,'height');
            let topRadius = this.reader.getFloat(leaf,'topRadius');
            let bottomRadius = this.reader.getFloat(leaf,'bottomRadius');
            let stacks = this.reader.getFloat(leaf,'stacks');
            let slices = this.reader.getFloat(leaf,'slices');

            vector.push(new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks));
        }
        
    }


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
        //To do: Create display loop for transversing the scene graph, calling the root node's display function
    
        this.scene.pushMatrix();

        this.root.display();

        this.scene.popMatrix();   

    }
}