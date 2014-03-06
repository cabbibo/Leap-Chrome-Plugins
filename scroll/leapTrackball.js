 THREE.LeapTrackballControls = function ( object , controller , params, domElement ) {

    this.object     = object;
    this.controller = controller;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.clock = new THREE.Clock();

    this.speed = 10;

    // Place the camera wherever you want it
    // but use a rotating object to place
    this.rotatingObject = new THREE.Object3D();

    this.rotatingCamera = new THREE.Object3D();
    this.rotatingCamera.position = this.object.position.clone();

    this.rotatingObject.add( this.rotatingCamera );

    //console.log( rotatingObject );

    this.dampening = .99;

    this.rotation = new THREE.Quaternion();
    this.angularVelocity = new THREE.Vector3();


    this.getTorque = function(){

      var frame = this.controller.frame();

      var torqueTotal = new THREE.Vector3();
      
      
      if( frame.hands[0] ){

        //console.log( this.angularVelocity );
        hand = frame.hands[0];
        var hDirection = new THREE.Vector3().fromArray( hand.direction );

        for( var i = 0; i < hand.fingers.length; i++ ){

          var finger = hand.fingers[i];

          if( finger.extended ){

            var fD = finger.direction;
            var fV = finger.tipVelocity;
            
            // First off see if the fingers pointed
            // the same direction as the hand
            var fDirection = new THREE.Vector3().fromArray( fD );
            var match = fDirection.dot( hDirection );

            var fVelocity = new THREE.Vector3().fromArray( fV );
            fVelocity.multiplyScalar( (this.speed  / 100000) * match );

            var torque = new THREE.Vector3().crossVectors( fVelocity , hDirection );
            torqueTotal.add( torque );

          }

        }

      }

      return torqueTotal;

    }


    this.update = function(){

      var torque = this.getTorque();

      // Make sure it always moves smooth, no matter what frame rate!
      var dTime = this.clock.getDelta();

      //console.log( dTime );

      this.angularVelocity.add( torque );
      this.angularVelocity.multiplyScalar( this.dampening );
      //angularVelocity.set( 1 , 0 , 0 );

      
      var angularDistance = this.angularVelocity.clone().multiplyScalar( dTime );

      var axis  = angularDistance.clone().normalize();
      var angle = angularDistance.length();

      var rotationChange = new THREE.Quaternion();
      rotationChange.setFromAxisAngle( axis , angle );

      var rotation = new THREE.Quaternion();
      rotation.multiplyQuaternions( rotationChange , this.rotation );

      this.rotation = rotation;

      this.rotatingObject.rotation.setFromQuaternion( rotation );

      this.rotatingObject.updateMatrix();
      
     // this.updateCameraPosition();

    }


    this.updateCameraPosition = function(){

      // Makes sure that if the camera is moving we are updating it
      this.rotatingCamera.position = this.object.position.clone();

      // Need to convert to world position here.
      var worldPosition = this.object.position.clone();
      worldPosition.applyMatrix4( this.rotatingObject.matrix );

      this.object.position = worldPosition;

      // The camera is always looking at the center of the object
      // it is rotating around.
      this.object.lookAt( this.rotatingObject.position );

    }

  }


  // This function moves from a position from leap space, 
  // to a position in scene space, using the sceneSize
  // we defined in the global variables section
  function leapToScene( position ){

    var x = position[0] - frame.interactionBox.center[0];
    var y = position[1] - frame.interactionBox.center[1];
    var z = position[2] - frame.interactionBox.center[2];
      
    x /= frame.interactionBox.size[0];
    y /= frame.interactionBox.size[1];
    z /= frame.interactionBox.size[2];

    x *= sceneSize;
    y *= sceneSize;
    z *= sceneSize;

    z -= sceneSize;

    return new THREE.Vector3( x , y , z );

  }
