var camera, scene, renderer;

var HUD;

var projector , raycaster;
var sceneSize = 100;

var mouse = { x:0 , y:0 }

setTimeout( init , 1000 );

var linkMeshes = [];

function init(){

  var ar = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 75, ar, 1, 5000 );
  camera.position.set( 0 , 0 , sceneSize );
  camera.lookAt( new THREE.Vector3() );

  controller = new Leap.Controller({ enableGestures: true });

  //controls = new THREE.LeapTrackballControls( camera , controller );
  controls = new THREE.TrackballControls( camera );

  scene = new THREE.Scene();

  var linkMaterial = new THREE.MeshPhongMaterial({
    color:0x7777cc,
    specular: 0xffffff,
    diffuse: 0xff0000,
    shading: THREE.FlatShading
  });   

  var subLinkMaterial = new THREE.MeshPhongMaterial({
    color:0x339997,
    specular: 0x00ffff,
    diffuse: 0x00fff0,
    shading: THREE.FlatShading
  }) 

  var linkGeometry = new THREE.IcosahedronGeometry( sceneSize / 40 , 2 );
  var subLinkGeometry = new THREE.IcosahedronGeometry( sceneSize / 80 );

  var msg = new SpeechSynthesisUtterance('Hello World');
  console.log( msg );
  msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Whisper'; })[0];
  window.speechSynthesis.speak(msg);

  console.log( speechSynthesis.getVoices() );/*
  speechSynthesis.getVoices().forEach(function(voice) {
  console.log(voice.name, voice.default ? '(default)' :'');
});*/


  for( var i = 0; i< links.length; i++ ){

    var linkMesh = new THREE.Mesh( linkGeometry , linkMaterial );

    linkMesh.position.x = ( Math.random() - .5 ) * sceneSize / 2;
    linkMesh.position.y = ( Math.random() - .5 ) * sceneSize / 2;
    linkMesh.position.z = ( Math.random() - .5 ) * sceneSize / 2 ;

    linkMesh.html = links[i].innerHTML;
    linkMesh.href = links[i].href;

    linkMeshes.push( linkMesh );

    scene.add( linkMesh );

    for( var j = 0; j < links[i].subLinks.length ; j++ ){


      var subLinkMesh = new THREE.Mesh( subLinkGeometry , subLinkMaterial );

      subLinkMesh.position.x = ( Math.random() - .5 ) * sceneSize / 10;
      subLinkMesh.position.y = ( Math.random() - .5 ) * sceneSize / 10;
      subLinkMesh.position.z = ( Math.random() - .5 ) * sceneSize / 10;

      subLinkMesh.html = links[i].subLinks[j].innerHTML;
      subLinkMesh.href = links[i].subLinks[j].href;


      linkMesh.add( subLinkMesh );

      linkMeshes.push( subLinkMesh );

    }


  }

  var light = new THREE.AmbientLight( 0x00ff00 );
  var light = new THREE.DirectionalLight( 0xaa22aa , 1.6);
  light.position.set( 0, 0, 1 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0x5555aa , 1.6);
  light.position.set( 0, 1, 1 );
  scene.add( light );

   var light = new THREE.DirectionalLight( 0xaa5555 , 1.6);
   light.position.set( -1,0 , 1 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xaa22aa , 1.6);
  light.position.set( 0, 0, -1 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0x5555aa , 1.6);
  light.position.set( 0, -1, -1 );
  scene.add( light );

   var light = new THREE.DirectionalLight( 0xaa5555 , 1.6);
   light.position.set( 1,0 , -1 );
  scene.add( light );




  projector = new THREE.Projector();
  raycaster = new THREE.Raycaster();

  /*var geo = new THREE.IcosahedronGeometry( sceneSize / 20  );
  var mat = new THREE.MeshNormalMaterial();

  for( var i = 0; i < 50 ; i++ ){

    var mesh = new THREE.Mesh( geo , mat );
    mesh.position.x = ( Math.random() - .5 ) * sceneSize;
    mesh.position.y = ( Math.random() - .5 ) * sceneSize;
    mesh.position.z = ( Math.random() - .5 ) * sceneSize;

    scene.add( mesh );

  }*/

 // scene.add( controls.rotatingObject );

  // Getting the container in the right location
  container = document.createElement( 'div' );

  container.style.width         = '100%';
  container.style.height        = '100%';
  container.style.position      = 'fixed';
  container.style.zIndex        = '998';

  container.style.top           = '0px';
  container.style.left          = '0px';
  container.style.pointerEvents = 'none';
  container.style.background    = 'rgba( 0 , 0 , 0 , 1)';

  document.body.appendChild( container );

  HUD = document.createElement( 'div' );
  HUD.id = 'HUD';

  HUD.style.width         = '100%';
  HUD.style.height        = '100%';
  HUD.style.position      = 'fixed';
  HUD.style.zIndex        = '999';

  HUD.style.top           = '0px';
  HUD.style.left          = '0px';
  HUD.style.pointerEvents = 'none';
  HUD.style.background    = 'rgba( 255 , 0 , 0 , 0)';

  document.body.appendChild( HUD );

  var marker = initMarker();
  
  renderer = new THREE.WebGLRenderer( { alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
 // renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.pointerEvents  = 'none';
  container.appendChild( renderer.domElement );


  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'click', onDocumentClick, false );

				//

  window.addEventListener( 'resize', onWindowResize, false );


  controller.connect();

  animate();

}

function animate(){

  requestAnimationFrame( animate );

  controls.update();

  renderer.render( scene, camera );

  Math.findIntersections();

}
  
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  renderer.render( scene, camera );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x =   ( event.clientX / window.innerWidth   ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight  ) * 2 + 1;

}

function onDocumentClick( event ) {

  event.preventDefault();

  console.log( INTERSECTED );
  if( INTERSECTED )
    window.location = INTERSECTED.href;

  
}





