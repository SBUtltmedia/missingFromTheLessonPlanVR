var startingRoom = "4marvin"
var sceneEl;

var currentLocation;
$(function() {
  document.querySelector('a-assets').addEventListener('loaded', assetsLoaded)
  $('#loader').spin('large', '#FF0000')

  $("html").on("click",function(){
    var o={}
  o.x=  sceneEl.querySelector('#camera').getAttribute('rotation').x;
  o.y=  sceneEl.querySelector('#camera').getAttribute('rotation').y;
  o.radius=-11;
  console.log(JSON.stringify(o));
  })

});


AFRAME.registerComponent('cursor-listener', {
  init: function() {

    this.el.addEventListener('click', function(evt) {

      var newroom =$(evt.target).data("room") || currentLocation.room;
      if ($(evt.target).data("triggertype") == "scene") {
          loadSphere(startingRoom, $(evt.target).data("number"),0);
      } else if ($(evt.target).data("triggertype") == "image") {

        showPoster(evt.target);
      }
    else   if ($(evt.target).data("triggertype") == "walkToImage") {
      var startingAngle =    $(evt.target).data("startingAngle")||0;
          loadSphere(newroom , $(evt.target).data("number"),0);
            showPoster(evt.target);
        }




      else{

        var hudA = sceneEl.querySelector('#posterHud');
        hudA.emit('hudHide');
        hudA.setAttribute("visible", false);
        makeMarkers(currentLocation)

        console.log(showPoster)

      }



    });
  }
});

function leftPad(num) {
  return ("0" + num).slice(-2)
}

function assetsLoaded() {

  sceneEl = document.querySelector('a-scene');
  loadSphere(startingRoom, 5,-20.282705947630927);

  var markers = document.getElementById('markers')


  $('#loader').spin(false)
  $("#loader").remove();
}

function loadSphere(room, num,angle) {
  //Start by setting the Look-at-angle so the camera faces the right way
  //You need to disable the look-controls first and then reenable them after setting rotation
  sceneEl.querySelector('#camera').setAttribute('look-controls', {enabled: false})
  if (!angle){
    sceneEl.querySelector('#camera').setAttribute('rotation', {
      y: 0,
      x: 0,
      z: 0
    });
  }
  else {
    sceneEl.querySelector('#camera').setAttribute('rotation', {
      y: angle,
    });
  }
  sceneEl.querySelector('#camera').setAttribute('look-controls', {enabled: true})

  $.getJSON(room + ".json", function(data) {
    currentLocation =data.spheres[num];
    currentLocation.room=room;
    //currentLocation.startingAngle;
    //angle = (typeof angle !== 'undefined') ?  angle : 0;
    //angle=  angle||currentLocation.startingAngle;
    //console.log(angle);
    //document.querySelector('#camera').setAttribute('rotation', {x: angle, y: 0, z: 0});

    $("#sky1").attr("src",   currentLocation.leftImg);

    makeMarkers(currentLocation)



  }).fail(function(event, jqxhr, exception) {

  })
}


function showPoster(mkr) {
  console.log($(mkr))
  var poster = document.getElementById('posterHud')

  poster.setAttribute("visible", true);
  poster.emit('hudShow');

  poster.setAttribute('src', $(mkr).data("src"));
  poster.setAttribute('rotation', {
    y:$(mkr).data("y"),
    x:$(mkr).data("x")
  });

}



function makeMarker(mkr, id) {
  var lastMarkerHolder = document.querySelector("#markerHolder" + id);
  if(lastMarkerHolder){document.querySelector('#markers').removeChild(lastMarkerHolder);}

  var markerHolder = document.createElement('a-entity');

  markerHolder.setAttribute("id", "markerHolder" + id)
  if (mkr.triggertype == "scene") {
  //  var spin = Math.atan2(mkr.x, mkr.z) * (180 / Math.PI) + 180;
    var marker = document.createElement('a-sphere');
    marker.setAttribute('color', "#2fff00");
    marker.setAttribute('radius', "0.2");
    marker.setAttribute('opacity', ".7");

  } else {
    var marker = document.createElement('a-sphere');
    marker.setAttribute('radius', "0.2")
    marker.setAttribute('color', "#f10e0e")
    marker.setAttribute('opacity', ".7")
  }

  marker.setAttribute('position', {
    x: 0,
    y: 0,
    z: mkr.radius
  });



  for (var key in mkr) {

    marker.setAttribute('data-' + key, mkr[key])
  }

  marker.setAttribute("cursor-listener","")
  marker.setAttribute("id", "marker" + id)
  marker.setAttribute('data-num', mkr.number);
  marker.setAttribute('data-room', mkr.room || "");
  marker.setAttribute("class", "marker")
  document.querySelector('#markers').appendChild(markerHolder)
  document.querySelector('#markerHolder'+ id).appendChild(marker)
  markerHolder.setAttribute('rotation', {
  y:mkr.y,
  x:mkr.x
  });

   //console.log(sceneEl.querySelector("#markerHolder" + id).getAttribute('rotation'))
}

function makeMarkers(currentLocation) {
  $(".marker").remove();

  currentLocation.markers.forEach(function(val, index, array) {
  //Marker generation for current scene
  makeMarker(val, index);
});

  showPoster("#marker4");
}
