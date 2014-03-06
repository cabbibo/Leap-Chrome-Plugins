

var marker;

function initMarker(){

  marker = document.createElement( 'div' );
   
  //marker.style.width         = '50px';
  //marker.style.height        = '50px';
  marker.style.position       = 'fixed';
  marker.style.zIndex         = '999';

  marker.style.top            = '0px';
  marker.style.left           = '0px';
  marker.style.pointerEvents  = 'none';
  marker.style.background     = 'rgba( 255 , 255 , 255 , .7 )';
  marker.style.border         = '1px solid black';


  HUD.appendChild( marker );

  return marker;

}

function fillMarker( object ){

  marker.innerHTML = object.html;

}
function placeMarker( position ){

  marker.style.display= 'block';

  marker.style.top  = position.y + 'px';
  marker.style.left = position.x + 'px';

}

function hideMarker(){

  marker.style.display= 'none';


}
