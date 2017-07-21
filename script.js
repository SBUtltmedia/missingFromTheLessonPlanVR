var startingRoom = "4marvin"
var sceneEl;
var currentFuse;
$(function() {
  document.querySelector('a-assets').addEventListener('loaded', assetsLoaded)
  $('#loader').spin('large', '#FF0000')
});


AFRAME.registerComponent('cursor-listener', {
  init: function() {

    this.el.addEventListener('click', function(evt) {
      var hudA = sceneEl.querySelector('#posterHud');
      hudA.emit('hudHide');
      hudA.setAttribute("visible", false);

    });
  }
});

function leftPad(num) {
  return ("0" + num).slice(-2)
}

function assetsLoaded() {

  loadSphere(startingRoom, 5);
  var markers = document.getElementById('markers')

  sceneEl = document.querySelector('a-scene');
  $('#loader').spin(false)
  $("#loader").remove();
}

function loadSphere(room, num) {
  $.getJSON(room + ".json", function(data) {
    //Clean up previous scene
    $('.marker').remove();
    $('.preview').remove();
    //Update the background
    $("#sky1").attr("src", data.spheres[num].leftImg);
    data.spheres[num].markers.forEach(function(val, index, array) {
      //Marker generation for current scene
      makeMarker(val, index);
    });

    $(".marker").on("click", function(evt) {

      if ($(evt.target).data("triggertype") == "scene") {
        if ($(evt.target).data("room") == "") {
          loadSphere(room, $(evt.target).data("number"));
        } else {
          loadSphere($(evt.target).data("room"), $(evt.target).data("number"));
        }
      }

      currentFuse = evt.target;
      console.log(currentFuse);
      var hudA = sceneEl.querySelector('#posterHud');
      if ($(evt.target).data("triggertype") == "image") {
        hudA.setAttribute("visible", true);
        hudA.emit('hudShow');

        zoomIn(evt.target);
        evt.target.setAttribute("scale", "18 18 18");
        evt.target.setAttribute("opacity", 0);
      }



    });

    $(".marker").on("fusing", function(evt) {

    });

    //$('#cursor').on('mouseleave', mouseleave);


    var cursor = sceneEl.querySelector('#cursor');
    cursor.addEventListener('mouseleave', mouseleave);


    function zoomIn(mkr) {
      var poster = document.getElementById('posterHud')
      console.log($(mkr).data("z"))
      eX = $(mkr).data("x");
      eY = $(mkr).data("y");
      eZ = $(mkr).data("z");

      var spinLeftRight = Math.atan2(eX, eZ) * (180 / Math.PI) + 180;
      var mag = Math.sqrt(eX * eX + eZ * eZ)
      var spinUpDown = Math.atan2(mag, eY) * (180 / Math.PI) + 180;
      // var spinUpDown=0;
      console.log(spinLeftRight, spinUpDown);
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


  }).fail(function(event, jqxhr, exception) {

  })
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
    console.log(key)
    marker.setAttribute('data-' + key, mkr[key])
  }

  marker.setAttribute("cursor-listener")
  marker.setAttribute("id", "marker" + id)
  marker.setAttribute('data-num', mkr.number);
  marker.setAttribute('data-room', mkr.room || "");
  marker.setAttribute("class", "marker")
  $("#markers").prepend(marker)
}

function makeMarkers() {

}
