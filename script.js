var startingRoom = "4marvin"
var sceneEl;

var currentLocation;
$(function() {
  document.querySelector('a-assets').addEventListener('loaded', assetsLoaded)
  $('#loader').spin('large', '#FF0000')
});


AFRAME.registerComponent('cursor-listener', {
  init: function() {

    this.el.addEventListener('click', function(evt) {
      var newroom =$(evt.target).data("room") || currentLocation.room;
      if ($(evt.target).data("triggertype") == "scene") {
          loadSphere(newroom , $(evt.target).data("number"));
      } else if ($(evt.target).data("triggertype") == "image") {

        showPoster(evt.target);
      }
    else   if ($(evt.target).data("triggertype") == "walkToImage") {
      var startingAngle =    $(evt.target).data("startingAngle")||0;
          loadSphere(newroom , $(evt.target).data("number"),startingAngle);
            showPoster(evt.target);
        }




      else{

        var hudA = sceneEl.querySelector('#posterHud');
        hudA.emit('hudHide');
        hudA.setAttribute("visible", false);
        makeMarkers(currentLocation)



      }



    });
  }
});

function leftPad(num) {
  return ("0" + num).slice(-2)
}

function assetsLoaded() {

  loadSphere(startingRoom, 5,0);
  var markers = document.getElementById('markers')

  sceneEl = document.querySelector('a-scene');
  $('#loader').spin(false)
  $("#loader").remove();
}

function loadSphere(room, num,angle) {

  $.getJSON(room + ".json", function(data) {
    currentLocation =data.spheres[num];
    currentLocation.room=room;
    currentLocation.startingAngle;
    angle = (typeof angle !== 'undefined') ?  angle : 0;
    angle=  angle||currentLocation.startingAngle;
    document.querySelector('#camera').setAttribute('rotation', {x: angle, y: 0, z: 0});

    $("#sky1").attr("src",   currentLocation.leftImg);

    makeMarkers(currentLocation)



  }).fail(function(event, jqxhr, exception) {

  })
}


function showPoster(mkr) {
  var poster = document.getElementById('posterHud')

  poster.setAttribute("visible", true);
  poster.emit('hudShow');

  eX = $(mkr).data("x");
  eY = $(mkr).data("y");
  eZ = $(mkr).data("z");

  var spinLeftRight = Math.atan2(eX, eZ) * (180 / Math.PI) + 180;
  var mag = Math.sqrt(eX * eX + eZ * eZ)
  var spinUpDown = Math.atan2(mag, eY) * (180 / Math.PI) + 180;
  // var spinUpDown=0;

  //var testObject = document.createElement('a-image');
  poster.setAttribute('src', $(mkr).data("src"));
  poster.setAttribute('rotation', {
    x: spinUpDown + 270,
    y: spinLeftRight + 180,
    z: 180,
  });
  //poster.setAttribute('height', 50);
  //poster.setAttribute('width', 50);
  poster.setAttribute('position', {
    x: 0,
    y: 0,
    z: 0
  });
  /*
  $("#closeBtn").setAttribute('position', {
    x: 1,
    y: 0,
    z: 1
  });
  */

  //
  //$("#markers").prepend(testObject)
}




function makeMarker(mkr, id) {

  if (mkr.triggertype == "scene") {
    var spin = Math.atan2(mkr.x, mkr.z) * (180 / Math.PI) + 180;
    var marker = document.createElement('a-image');
    marker.setAttribute('src', "img/nextMarker.png")
    marker.setAttribute('scale', "2 2 2")
    marker.setAttribute('opacity', ".8")
    marker.setAttribute('rotation', {
      x: -90,
      y: spin
    });
  } else {
    var marker = document.createElement('a-sphere');
    marker.setAttribute('radius', "0.2")
    marker.setAttribute('color', "#f10e0e")
    marker.setAttribute('opacity', ".7")
  }

  marker.setAttribute('position', {
    x: mkr.x,
    y: mkr.y,
    z: mkr.z
  });
  //        marker.setAttribute('rotation', {
  //          x: 10,
  //        y:spin,
  //        z:10
  //        });
  for (var key in mkr) {

    marker.setAttribute('data-' + key, mkr[key])
  }

  marker.setAttribute("cursor-listener","")
  marker.setAttribute("id", "marker" + id)
  marker.setAttribute('data-num', mkr.number);
  marker.setAttribute('data-room', mkr.room || "");
  marker.setAttribute("class", "marker")
 document.querySelector('#markers').appendChild(marker)
}

function makeMarkers(currentLocation) {
  $('.marker').remove();

  currentLocation.markers.forEach(function(val, index, array) {
  //Marker generation for current scene
  makeMarker(val, index);
});

$(".marker").on("clck", function(evt) {

});
}
