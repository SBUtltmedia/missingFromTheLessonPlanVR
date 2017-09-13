var startingRoom = "4marvin"
var sceneEl;
var markers;
var currentLocation;
var cameraCache;
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


// AFRAME.registerComponent('resetorientation', {
//   init: function () {
//     var el = this.el;
//     el.addEventListener('resetorientation', function () {
//       console.log(el)
//       el.setAttribute('rotation', {x:0,y:0,z:0});
//     });
//   }
// });


AFRAME.registerComponent('cursor-listener', {
  init: function() {

    this.el.addEventListener('click', function(evt) {
console.log(evt)


      if($(evt.target).attr("id")=="closeBtn"){
    hudHide(currentLocation)

      }
      else{

      var marker = evt.target.id




      if (markers[marker].triggerType == "walkToImage" ||markers[marker].triggerType== "scene") {
    hudHide(currentLocation)
        var startingAngle =markers[marker].startingAngle;
        loadSphere(startingRoom, markers[marker].number, startingAngle,markers[marker].src );

      }
      if (markers[marker].triggerType== "image") {
        showPoster(markers[marker].src);
      }
      if (markers[marker].triggerType== "video") {
        showMovie(markers[marker].src);
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
  cameraCache=$('#camera');
  loadSphere(startingRoom, 5, -20.282705947630927, "#missingPoster");

  var markers = document.getElementById('markers')


  $('#loader').spin(false)
  $("#loader").remove();
}

function loadSphere(room, sphereNum, angle, startingImage) {
    console.log(angle)
    var cameraEl = document.querySelector('#camera');
    // cameraEl.removeAttribute('camera');
    //cameraEl.removeAttribute('look-controls');
    //cameraEl.removeAttribute('rotation');
    // cameraEl.setAttribute('camera');
    //cameraEl.setAttribute('look-controls');
    //cameraEl.setAttribute('rotation');


  //Start by setting the Look-at-angle so the camera faces the right way
  //You need to disable the look-controls first and then reenable them after setting rotation
  // sceneEl.querySelector('#camera').setAttribute('look-controls', {
  //   enabled: false
  // })
  if (!angle) {
    sceneEl.querySelector('#tripod').setAttribute('rotation', {
      y: 0,
      x: 0,
      z: 0
    });
  } else {

    sceneEl.querySelector('#tripod').setAttribute('rotation', {
      x: 0,
      y: 0,
      z: 0
    });
  }
  // sceneEl.querySelector('#camera').setAttribute('look-controls', {
  //   enabled: true
  // })

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


}
function showPoster(src) {

  var id =getIdFromSrc(src);
    console.log(id,src)
  var poster = document.getElementById('posterHud')

  poster.setAttribute("visible", true);
  poster.emit('hudShow');
  poster.setAttribute('src',markers[id].src );
  poster.setAttribute('rotation', {
    x: markers[id].x,
    y: markers[id].y
  });

}

function showMovie(src) {

  var id = getIdFromSrc(src);
    console.log(id,src)
  var video = document.getElementById('vidHud')

  video.setAttribute("visible", true);
  video.emit('vidShow');
  //ˆvideo.setAttribute('src',markers[id].src);
  video.play()
  console.log(video.isPlaying)

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
