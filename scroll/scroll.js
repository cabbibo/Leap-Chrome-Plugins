
  /*

     Page Scroll v 1.0

     This page scroll method uses a few different interactions which
     should *in theory* make for a smooth interaction.

     -  The first part of the interaction is a momentum based swipe
        based on finger tip speed and numbers. The alterable variables
        
        - forceRatio: change how much force will be added
        - matchRatio: change how much fingerDir and handDir must match

        It is important to note that for this first mode of interaction
        also sees how much a fingers direction matches with the hand 
        direction. 

    -   The second part of the interaction is the 'pinch'. Once pinched,
        the scroll should follow the users hand with exact precision.
        the alterable variables:

        - pinchCutoff: number at which pinch starts
        - pinchMovementRatio: how much the pinch moves the scrolling

    
    - Other Alterable variables:
        
        - dampening: amount we slow down



  */

  var params = {

    forceRatio: .01,
    matchPower: 3,
    matchCutoff: .7,

    pinchCutoff: .5, 
    pinchMovementRatio: .1,

    dampening: .97,

  }


  var position = 0;
  var velocity = 0;

  var dampening = .97;

  var controller;

  var gui;




  init();
  animate();

  function init(){

    controller = new Leap.Controller({ enableGestures: true });
    controller.connect();

    gui = new dat.GUI();

    // Setting up gui
    gui.add( params , 'forceRatio' );
    gui.add( params , 'matchPower' );
    gui.add( params , 'matchCutoff' );
    gui.add( params , 'pinchCutoff' );
    gui.add( params , 'pinchMovementRatio' );
    gui.add( params , 'dampening' );

    gui.domElement.style.zIndex   = '9999';
    gui.domElement.style.position = 'fixed';
    gui.domElement.style.bottom   = '100px';
    gui.domElement.style.right    = '0px';
    
    console.log( gui );


  }

  function animate(){
    
    updatePosition();

    window.scrollTo( 0 , position );
    window.requestAnimationFrame( animate );

  }


  function updatePosition(){

    var pinchStrength = getPinchStrength();

    var dampening = 1 - pinchStrength;


    if( pinchStrength < params.pinchCutoff ){ 

      var force         = getTotalForce();

      velocity += force;

    }else{

      //console.log(pinchStrength);
      var hand = controller.frame().hands[0];

      velocity = hand.palmVelocity[1] * params.pinchMovementRatio ;

    }
  
    // Updating of 
    position += velocity;
    velocity *= params.dampening;

    /*
      Bounding the scrolling to the top and bottom of
      the page
    */
    if( position < 0 ){
      position = 0;
      velocity = 0;
    }

    // TODO: Don't know if this will work for all 
    // sites, or just full site ones...
    var totalHeight = position + window.innerHeight;
    var scrollHeight = document.documentElement.scrollHeight;
    if( totalHeight > scrollHeight ){
      position = scrollHeight - window.innerHeight;
      velocity = 0;
    }
   
    ///console.log( document.documentElement.scrollHeight );



  }

  function getPinchStrength(){

    var frame         = controller.frame();
    var pinchStrength = 0;

    if( frame.hands[0] ){

      var hand = frame.hands[0];
     
      pinchStrength = hand.pinchStrength;

    }

    return pinchStrength;

  }


  function getTotalForce(){

    var frame = controller.frame();

    var totalForce = 0;

    if( frame.hands[0] ){

      var hand = frame.hands[0];

      var handDirection = new THREE.Vector3();
      handDirection.fromArray( hand.direction );

      for( var i = 0; i < hand.fingers.length; i++ ){

        var finger = hand.fingers[i];

        if( finger.extended ){

          var fD = finger.direction;
          var fV = finger.tipVelocity;

          var fingerDirection = new THREE.Vector3();
          fingerDirection.fromArray( fD );

          var fingerVelocity = new THREE.Vector3();
          fingerVelocity.fromArray( fV );

          var match = fingerDirection.dot( handDirection );

          // Cuts off our matching if the direction isn't in alignment
          if( match > params.matchCutoff ){
            
            var matchPower = Math.pow( match , params.matchPower );
            var force = fingerVelocity.y * matchPower;

            totalForce += force * params.forceRatio;

          }


        }


      }


    }
    

    return totalForce;

  }



