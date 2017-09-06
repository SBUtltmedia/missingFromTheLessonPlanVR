var startingRoom = "4marvin"
var sceneEl;
var markers;
var currentLocation;
$(function() {
  document.querySelector('a-assets').addEventListener('loaded', assetsLoaded)
  $('#loader').spin('large', '#FF0000')

  $("html").on("click", function() {
    var o = {}
    o.x = sceneEl.querySelector('#camera').getAttribute('rotation').x;
    o.y = sceneEl.querySelector('#camera').getAttribute('rotation').y;
    o.radius = -11;
    console.log(JSON.stringify(o));
  })

});


AFRAME.registerComponent('cursor-listener', {
  init: function() {

    this.el.addEventListener('click', function(evt) {
      if($(evt.target).attr("id")=="closeBtn"){
        //close poster button
      hudHide(currentLocation)

      }
      else{

      var marker = evt.target.id

      var newroom = markers[evt.target.id].number
      if (markers[evt.target.id].number == 'undefined'){
        var closeBtn = sceneEl.querySelector('#closeBtn').getAttribute('id')
      }

      if (markers[evt.target.id].triggerType == "walkToImage" ||markers[evt.target.id].triggerType== "scene") {

        var startingAngle =markers[evt.target.id].startingangle;
        loadSphere(startingRoom, markers[evt.target.id].number, startingAngle,markers[evt.target.id].src );

      }
      if (markers[evt.target.id].triggerType== "image") {
        showPoster(markers[evt.target.id].src);
      }

    }


    });
  }
});




function hudHide(currentLocation){

  var hudA = sceneEl.querySelector('#posterHud');
  hudA.emit('hudHide');
  hudA.setAttribute("visible", false);
  makeMarkers(currentLocation)

}

function leftPad(num) {
  return ("0" + num).slice(-2)
}

function assetsLoaded() {

  sceneEl = document.querySelector('a-scene');
  console.log(sceneEl.querySelector('#marker4'));
  loadSphere(startingRoom, 5, -20.282705947630927, "#missingPoster");

  var markers = document.getElementById('markers')


  $('#loader').spin(false)
  $("#loader").remove();
}

function loadSphere(room, sphereNum, angle, startingImage) {
    console.log(angle)

  //Start by setting the Look-at-angle so the camera faces the right way
  //You need to disable the look-controls first and then reenable them after setting rotation
  sceneEl.querySelector('#camera').setAttribute('look-controls', {
    enabled: false
  })
  if (!angle) {
    sceneEl.querySelector('#camera').setAttribute('rotation', {
      y: 0,
      x: 0,
      z: 0
    });
  } else {

    sceneEl.querySelector('#camera').setAttribute('rotation', {
      x: 0,
      y: angle,
      z: 0
    });
  }
  sceneEl.querySelector('#camera').setAttribute('look-controls', {
    enabled: true
  })

  $.getJSON(room + ".json", function(data) {
    currentLocation = data.spheres[sphereNum];
    currentLocation.room = room;
    //currentLocation.startingAngle;
    //angle = (typeof angle !== 'undefined') ?  angle : 0;
    //angle=  angle||currentLocation.startingAngle;
    //console.log(angle);
    //document.querySelector('#camera').setAttribute('rotation', {x: angle, y: 0, z: 0});

    $("#sky1").attr("src", currentLocation.leftImg);
  //  hudHide(currentLocation);
    markers=currentLocation.markers;
    makeMarkers(currentLocation)

if(startingImage){
 showPoster(startingImage)
}




  }).fail(function(event, jqxhr, exception) {

  })
}


function getIdFromSrc(src)
{

for(i=0;i<markers.length;i++)
{

if (markers[i].src==src)
{
return i;
}

}

//   markers.forEach(function(val,index){
//
// if(val.src=="#missingPoster")
//
// return index;
// })
}
function showPoster(src) {
  var id =getIdFromSrc(src);
  var poster = document.getElementById('posterHud')

  poster.setAttribute("visible", true);
  poster.emit('hudShow');
  poster.setAttribute('src',markers[id].src );
  poster.setAttribute('rotation', {
    x: markers[id].x,
    y: markers[id].y
  });

}



function makeMarker(mkr, id) {
  var lastMarkerHolder = document.querySelector("#markerHolder" + id);
  if (lastMarkerHolder) {
    document.querySelector('#markers').removeChild(lastMarkerHolder);
  }

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





  marker.setAttribute("cursor-listener", "")
  marker.setAttribute("id",  id)
  marker.setAttribute("class", "marker")
  document.querySelector('#markers').appendChild(markerHolder)
  document.querySelector('#markerHolder' + id).appendChild(marker)
  markerHolder.setAttribute('rotation', {
    y: mkr.y,
    x: mkr.x
  });

  //console.log(sceneEl.querySelector("#markerHolder" + id).getAttribute('rotation'))
}

function makeMarkers(currentLocation) {
  $(".marker").remove();


   markers.forEach(function(val, index, array) {
     val.id=index;
    //Marker generation for current scene
    makeMarker(val, index);
  });


}
