//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js','CGFResourceReader.js',
'CGFOBJModel.js', 'MySceneGraph.js', 'MyInterface.js', 
'primitives/MyRectangle.js', 'MyComponent.js', 'primitives/MyTriangle.js', 'primitives/MyCylinder.js', 'primitives/MySphere.js', 'primitives/MyTorus.js', 
'animation/MyAnimation.js', 'animation/MyKeyframeAnimation.js', 'animation/MyKeyframe.js','sprites/MySpriteSheet.js','sprites/MySpriteText.js','sprites/MySpriteAnimation.js', 'primitives/MyPlane.js', 'primitives/MyPatch.js', 'primitives/MydefBarrel.js',
'gameprimitives/MyPiece.js','gameprimitives/MyChecker.js','gameprimitives/MyGreenSkull.js','gameprimitives/MyTile.js', 'MyGameBoard.js', 
'MyGameSequence.js', 'MyGameMove.js', 'MyGameOrchestrator.js', 'MyServer.js', 'MyMenu.js', 'gamestates/MyGameState.js', 
'gamestates/OrcPieceState.js', 'gamestates/OrcTileState.js', 'gamestates/GoblinPieceState.js', 'gamestates/GoblinTileState.js', 'gamestates/ZombiePieceState.js', 'gamestates/ZombieTileState.js', 'gamestates/ChoiceState.js', 'gamestates/OrcPlayAgainState.js', 
'gamestates/GoblinPlayAgainState.js', 'gamestates/ZombiePlayAgainState.js', 'gamestates/GameOverState.js', 'MyAuxiliarBoard.js', 'gamestates/BotState.js', 'gamestates/WaitingState.js',
'MyAnimatedCamera.js',


main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);
	
	// start
    app.run();
}

]);