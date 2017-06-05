var startingRoom = "4marvin"
var sceneEl;
var currentFuse;
$(function () {
    loadSphere(startingRoom, 0);
    var markers = document.getElementById('markers')
    markers.setAttribute('rotation', {
        x: 90,
        y: 0,
        z: 180
    });

    sceneEl = document.querySelector('a-scene');
});


AFRAME.registerComponent('cursor-listener', {
    init: function () {
        var COLORS = ['red', 'green', 'blue'];
        this.el.addEventListener('click', function (evt) {
            var randomIndex = Math.floor(Math.random() * COLORS.length);
            this.setAttribute('material', 'color', COLORS[randomIndex]);
            console.log('I was clicked at: ', evt.detail.intersection.point);
        });
    }
});

function leftPad(num) {
    return ("0" + num).slice(-2)
}

function loadSphere(room, num) {
    $.getJSON(room + ".json", function (data) {

        $('.marker').remove();
        $('.preview').remove();
        $("#sky1").attr("src", "img/" + data.spheres[num].leftImg);
        // $("#sky2").attr("src", "img/" + data.spheres[num].rightImg);

        data.spheres.forEach(function (val, index, array) {
            (new Image()).src = "img/" + val.leftImg;
            (new Image()).src = "img/" + val.rightImg
        });

        data.spheres[num].markers.forEach(function (val, index, array) {
            if (val.room) {
                (new Image()).src = "img/" + val.room + "_" + leftPad(val.number + 1) + "_Left.JPG";
                (new Image()).src = "img/" + val.room + "_" + leftPad(val.number + 1) + "_Right.JPG"
            }
            makeMarker(val, index);
        });

        $(".marker").on("click", function (evt) {
            if ($(evt.target).data("triggertype") == "scene") {
                if ($(evt.target).data("room") == "") {
                    loadSphere(room, $(evt.target).data("number"));
                } else {
                    loadSphere($(evt.target).data("room"), $(evt.target).data("number"));
                }
            }

        });


        $(".marker").on("fusing", function (evt) {
            $("#textHolder").attr("text", "value:" + $(evt.target).data("text") + "; align: center; color: red");
            currentFuse=evt.target;
            var hudA = sceneEl.querySelector('#posterHud');
            if ($(evt.target).data("triggertype") == "image") {
                hudA.emit('hudShow');
                zoom(evt.target);
                evt.target.setAttribute("scale","18 18 18");
                evt.target.setAttribute("opacity",0);
            }
        });

        //$('#cursor').on('mouseleave', mouseleave);


        var cursor = sceneEl.querySelector('#cursor');
        cursor.addEventListener('mouseleave', mouseleave);

        function mouseleave(event) {
          console.log($(currentFuse).data("triggertype"))
            if ($(currentFuse).data("triggertype") == "image") {
              currentFuse.setAttribute("scale","1 1 1");
              currentFuse.setAttribute("opacity",1);
              var hudA = sceneEl.querySelector('#posterHud');
              hudA.emit('hudHide');
              zoom(currentFuse);


            }


        }

        function zoom(mkr) {
          $("#posterHud").attr('src', $(mkr).data("src"));
        }

        function makeMarker(mkr, id) {
            console.log(mkr.type)

            var spin = Math.atan2(mkr.x, mkr.y) * (180 / Math.PI) + 180;
            var marker = document.createElement('a-sphere');
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
            //marker.setAttribute('src',  "nextMarker.png")
            marker.setAttribute('radius', "0.2")
            marker.setAttribute('color', "#f10e0e")
            marker.setAttribute('opacity', ".7")
            marker.setAttribute("cursor-listener")
            marker.setAttribute("id", "marker" + id)
            marker.setAttribute('data-num', mkr.number);
            marker.setAttribute('data-room', mkr.room || "");
            marker.setAttribute("class", "marker")
            $("#markers").prepend(marker)
        }
    }).fail(function (event, jqxhr, exception) {
        //Break case when JSON DNE, used for the shown fork on Github.io
        var preview = document.createElement('a-image');
        preview.setAttribute('position', {
            x: -0.84,
            y: 1.51,
            z: -0.68
        });
        preview.setAttribute('rotation', {
            x: 0,
            y: 59.01
        });
        preview.setAttribute('src', "Union404.png")
        preview.setAttribute("class", "preview")
        $("a-scene").prepend(preview)
    })
}
