var lastFrame;
var TRANSLATION_FACTOR = 20;
var SMOOTHING_FACTOR = 4;

var scene , camera;

//console.log( 'HELLO' );


// Global Variables for THREE.JS
  var container , camera, scene, renderer , stats;

  // Global variable for leap
  var frame, controller;

  // Variables for the physcial rotation;
  var angularVelocity, rotation, cube;


  var dampening = .9;
  var sceneSize = 100;



  var cube;
  
  // Get everything set up
  init();

  // Start the frames rolling
  animate();

  function init(){

    controller = new Leap.Controller({ enableGestures: true });

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 
      50 ,
      window.innerWidth / window.innerHeight,
      sceneSize / 100 ,
      sceneSize * 4
    );

    // placing our camera position so it can see everything
    camera.position.z = sceneSize;

    controls = new THREE.LeapTrackballControls( camera , controller );

    // Getting the container in the right location
    container = document.createElement( 'div' );

    container.style.width      = '100%';
    container.style.height     = '100%';
    container.style.position   =  'fixed';
    container.style.zIndex      = '999';

    container.style.top        = '0px';
    container.style.left       = '0px';
    container.style.pointerEvents = 'none';
    //container.style.background = '#000';

    document.body.appendChild( container );


    // Getting the stats in the right position
    stats = new Stats();

    stats.domElement.style.position  = 'absolute';
    stats.domElement.style.bottom    = '0px';
    stats.domElement.style.right     = '0px';
    stats.domElement.style.zIndex    = '999';

    document.body.appendChild( stats.domElement );


    // Setting up our Renderer
    renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );


    // Making sure our renderer is always the right size
    window.addEventListener( 'resize', onWindowResize , false );


    cube = new THREE.Mesh( 
      new THREE.CubeGeometry( sceneSize / 4 , sceneSize / 4 , sceneSize / 4 ),
      new THREE.MeshNormalMaterial({
        shading: THREE.FlatShading,
        wireframe: true
      })
      );

    cameraMarker = new THREE.Mesh(
      new THREE.CubeGeometry( sceneSize / 20 , sceneSize / 20 , sceneSize / 20 ),
      new THREE.MeshNormalMaterial({
       shading: THREE.FlatShading 
     })
    );

    cameraMarker.position.z = camera.position.z;

    angularVelocity = new THREE.Vector3();
    rotation        = new THREE.Quaternion();

    //scene.add( cube );

    scene.add( controls.rotatingObject );
    controls.rotatingObject.add( cube );
    controls.rotatingObject.add( cameraMarker );

    controller.connect();


  }


  function animate(){

    controls.update();

    stats.update();

    //cube.rotation.x += .01;
    //cube.rotation.y += .01;

    /*var pos = controls.rotatingObject.localToWorld( cameraMarker.position );
    console.log( pos );
    camera.position = pos;
    camera.lookAt( new THREE.Vector3() );*/
    
    renderer.render( scene , camera );

    requestAnimationFrame( animate );

  }

  function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

 

/*Leap.loop({enableGestures: true}, function (frame, done) {

  if (frame.pointables === undefined) {
    return;
  }
  //console.log(frame.pointables.length);

  if (frame.hands === undefined || frame.hands.length === 0) {
    $('body').css('transform', 'scale(1.0) rotate(0deg)');
  }

  if (frame.gestures && frame.gestures.length > 0) {
    browsePage(frame.gestures);
  } else if (frame.pointables.length === 2) {
    scrollPage(frame.pointables);
  } else if (frame.pointables.length > 2) {
    transformPage(frame.hands);
  }

  if (frame !== undefined && frame.pointables !== undefined && frame.pointables.length > 0) {
    lastFrame = frame;
  }

  done();
});

function scrollPage (pointables) {
  if (pointables === undefined || pointables.length === 0 || lastFrame === undefined || lastFrame.pointables.length === 0) {
    return;
  }

  var finger = pointables[0];
  var lastFinger = lastFrame.pointables[0];

  var hTranslation = 0;
  var hDelta = finger.tipPosition[0] - lastFinger.tipPosition[0];
  if (hDelta > 10) {
    hTranslation = TRANSLATION_FACTOR;
  } else if (hDelta < 10) {
    hTranslation = -TRANSLATION_FACTOR;
  }

  var vTranslation = 0;
  var vDelta = finger.tipPosition[1] - lastFinger.tipPosition[1];
  if (vDelta > SMOOTHING_FACTOR) {
    vTranslation = TRANSLATION_FACTOR;
  } else if (vDelta < -SMOOTHING_FACTOR) {
    vTranslation = -TRANSLATION_FACTOR;
  }

  // console.log("hTranslation: " + hTranslation);
  // console.log("vDelta: " + vDelta);

  window.scrollBy(hTranslation, vTranslation);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function transformPage(hands) {
  if (hands === undefined || hands.length === 0) {
    return;
  }

  var hand = hands[0];
  var rotateDegree = toDegrees(Math.atan(-hand.palmNormal[0], -hand.palmNormal[1]));
  $('body').css('transform', 'scale(' + hand._scaleFactor + ')' + ' rotateZ(' + rotateDegree + 'deg)');
}

function browsePage(gestures) {
  if (gestures[0].type === 'swipe' && gestures[0].state === 'stop') {
    if (gestures[0].direction[0] > 0) {
      history.forward();
    } else {
      history.back();
    }
  }
}*/
