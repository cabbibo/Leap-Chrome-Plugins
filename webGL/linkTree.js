
//TODO: Make sure that any links that have an href that is local, will get the properly applied url
  var elements = document.getElementsByTagName( 'a' );
  console.log( elements );

  var maxObjects = 10;
  var length = elements.length; 
  if( elements.length > maxObjects ) length = maxObjects;

  var links = [];

  for( var i = 0; i < length; i ++ ){

    var link = elements[i];
    var text = link.innerHTML;
    var href = link.href;

    link.subLinks = [];

    links.push( link );

    console.log( links );
     $.ajax({
      url: href,
      type: "GET",
      dataType: 'html',
      success: function(data) {


        var subLinks = $("<div>").html(data).find("a[href]");
        var length = subLinks.length;
        if( length > maxObjects ) length = maxObjects; 

        for (var j = 0; j < length; j++) {

          this.subLinks.push( subLinks[j] );
          //console.log(links[i].href);
        }

      }.bind( link ),

      error: function(data) {
        console.log("Failure");
      }
    });

  }

 
