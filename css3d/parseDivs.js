
  var elements = document.getElementsByTagName( 'a' );
  console.log( elements );

  var maxObjects = 10;
  var length = elements.lenght; 
  if( elements.length > maxObjects ) length = maxObjects;

  for( var i = 0; i < length; i ++ ){

    var link = elements[i];
    var text = link.innerHtml;
    var href = link.href;

    console.log( 'LINK' );
    console.log( text );
    console.log( href );

    fu
    


  }

  for( var i = 0; i < elements.length;
//TODO: Figure why it pulls it all
  $.ajax({
      url: 'https://airspace.leapmotion.com',
      type: "GET",
      dataType: 'html',
      success: function(data) {
        console.log(data);
        var links = $("<div>").html(data).find("a[href]");
        console.log(links.length);
        for (var i = 0, len = links.length; i < len; i++) {
          console.log( links[i] );
          //console.log(links[i].href);
        }
      },
      error: function(data) {
      console.log("Failure");
      }
    });



  var camera, scene, renderer;
  var controls;

  var maxObjects = 150;
  var objects  = [];
  var positions     = [];
  var sceneSize = 500;

  init();
  animate();

  function init() {

    var ar = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, ar, 1, 5000 );
	camera.position.set( 0 , 0 , sceneSize );
    camera.lookAt( new THREE.Vector3() );

    
    controller = new Leap.Controller({ enableGestures: true });

    controls = new THREE.LeapTrackballControls( camera , controller );
    //controls = new THREE.TrackballControls( camera );

    scene = new THREE.Scene();

    var l = elements.length;
    if( l > maxObjects ) l = maxObjects ;
  
    var cube = Math.floor( Math.pow( l , .333 ) );

    for( var i = 0; i < l; i++ ){

      var object = new THREE.CSS3DObject( elements[i] );
      objects.push( object );
      controls.rotatingObject.add( object );

      var position = new THREE.Object3D();

      position.x = ( Math.random() - .5 ) * sceneSize;
      position.y = ( Math.random() - .5 ) * sceneSize;
      position.z = ( Math.random() - .5 ) * sceneSize;

      positions.push( position );

    }

    scene.add( controls.rotatingObject );

    // Getting the container in the right location
    container = document.createElement( 'div' );

    container.style.width         = '100%';
    container.style.height        = '100%';
    container.style.position      =  'fixed';
    container.style.zIndex        = '999';

    container.style.top           = '0px';
    container.style.left          = '0px';
    container.style.pointerEvents = 'none';
    //container.style.background = '#000';

    document.body.appendChild( container );

    
    renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
   // renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.pointerEvents  = 'auto';
    container.appendChild( renderer.domElement );




    controller.connect();

    transform( positions ,  3000 );

    
  }

  function transform( targets , duration ){

    TWEEN.removeAll();

    for( var i = 0; i < objects.length; i++ ){

      var object = objects[i];
      var target = targets[i];


      new TWEEN.Tween( object.position )
        .to({
          x: target.x,
          y: target.y,
          z: target.z
        }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

    }




  }


  function animate(){

    requestAnimationFrame( animate );

    controls.update();

    //console.log( controls.rotatingObject.rotation );
    TWEEN.update();

    renderer.render( scene, camera );


  }
  
  function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

  }

