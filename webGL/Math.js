 
  var M = Math;

  var INTERSECTED;

  M.toCart = function( r , t , p ){

    var x = r *(Math.sin(t))*(Math.cos(p));
    var y = r *(Math.sin(t))*(Math.sin(p));
    var z = r * (Math.cos(t));
    return new THREE.Vector3(x,y,z);

  }

  M.getWorldPosition = function( object ){

    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( object.matrixWorld );

    return vector;

  }
  M.toScreenXY = function( position ) {
      var pos = position.clone();
      projScreenMat = new THREE.Matrix4();
      projScreenMat.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
      pos.applyProjection( projScreenMat );
      return { 
        x: ( pos.x + 1 ) * window.innerWidth / 2 ,
        y: ( -pos.y + 1) * window.innerHeight / 2,
      };

  }


  M.findIntersections = function(){

    //console.log( mouse.x , mouse.y );
    var vector = new THREE.Vector3( mouse.x, mouse.y, .5 );
    projector.unprojectVector( vector, camera );


    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( scene.children , true );

   // console.log( intersects );
    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            //if ( INTERSECTED ); //INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            //INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            //INTERSECTED.material.emissive.setHex( 0xff0000 );

            console.log( INTERSECTED );

            var pos = M.getWorldPosition( INTERSECTED );
            var posXY = M.toScreenXY( pos );
            placeMarker( posXY );
            fillMarker( INTERSECTED );


           /* for( var i = 0; i < linkMeshes.length; i++ ){
              if( INTERSECTED == linkMeshes ){
    

              }
            }*/
  
          }

    } else {


      hideMarker();
       // console.log('GOODBYE');
        INTERSECTED = null;

    }
  }
