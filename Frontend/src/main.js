$(function(){
    var $logo = $("#logo");
    var canvas = document.getElementById('plane');
    var context;
    var GoogleMap=require('./googleMaps');

    var sits = new Array(40);
    var flights = null;
    var API=require('./API');
    API.getFlights(function (error, data){
        if(error)alert(error);
        else flights=data;
        init();
    });




    function find(dest) {
        for (var i = 0; i < flights.length; i++) {
            if (flights[i].dest === dest) return flights[i].taken;
        }
    }

    function check(j, taken) {
        for (var i = 0; i < taken.length; i++) {
            if (taken[i] === j) return true;
        }
        return false;
    }

    var $flight = $("#flight");

    $flight.change(function () {
        init();
    });

    var plane = document.getElementById('scheme');

    $logo.mouseover(function () {
        $logo.prop("src", "images/Logo.gif");
    });
    $logo.mouseout(function () {
        $logo.prop("src", "images/Logo2.png");
    });
    $logo.click(function () {
        location.reload();
    });
    $("#mainPage").click(function () {
        location.reload();
    });

    $(".close").click(function () {
        $(".widget").removeClass("enabled");
        window.setTimeout(function(){
            $(".widget").hide();
            $("#background").hide();
        }, 300);
    });

    function init() {
        var bool;
        for (var i = 210, n = 0; i <= 740; i += 50) {
            for (var j = 585; j <= 810; j += 70) {
                bool = check(n, find($flight.find(":selected").val()));
                sits[n++] = {
                    x: j,
                    y: i,
                    w: 60,
                    h: 40,
                    br: 6,
                    taken: bool,
                    marked: false
                };
                if (j === 655) j += 15;
            }
            if (i === 530 || i === 360) i += 20;
        }
        redraw();

    }

    $("#oBook").click(function () {
        $("#book").show();
        window.setTimeout(function(){
            $("#book").addClass('enabled');
        }, 1);
        $("#background").show();
        context = canvas.getContext('2d');
        init();
    });

    var mousePos;
    window.onmousemove = function (event) {
        mousePos = getMousePos(canvas, event);
    };

    window.setInterval(function () {
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            redraw();
            for (var k = 0; k < sits.length; k++) {
                if (mousePos.x >= sits[k].x && mousePos.x <= sits[k].x + sits[k].w && mousePos.y >= sits[k].y && mousePos.y <= sits[k].y + sits[k].h && !sits[k].taken && !sits[k].marked) {
                    context.fillStyle = 'lightgray';
                    context.roundRect(sits[k].x, sits[k].y, sits[k].w, sits[k].h, sits[k].br).fill();
                    break;
                }
            }
        }
    }, 60);

    $(canvas).click(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        redraw();
        for (var k = 0; k < sits.length; k++) {
            if (mousePos.x >= sits[k].x && mousePos.x <= sits[k].x + sits[k].w && mousePos.y >= sits[k].y && mousePos.y <= sits[k].y + sits[k].h && !sits[k].taken) {
                if (!sits[k].marked) context.fillStyle = 'gray';
                else context.fillStyle = 'lightgray';
                sits[k].marked = !sits[k].marked;
                context.roundRect(sits[k].x, sits[k].y, sits[k].w, sits[k].h, sits[k].br).fill();
                break;
            }
        }
    });


    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return {
            x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    function redraw() {
        if(context) {
            context.drawImage(plane, -600, 0, 2650, 1200);
            for (var i = 0; i < sits.length; i++) {
                if (sits[i].marked) context.fillStyle = 'gray';
                if (sits[i].taken) context.fillStyle = 'black';
                context.roundRect(sits[i].x, sits[i].y, sits[i].w, sits[i].h, sits[i].br).stroke();
                if (sits[i].taken || sits[i].marked) context.roundRect(sits[i].x, sits[i].y, sits[i].w, sits[i].h, sits[i].br).fill();
            }
        }
    }

    $("#oPhone").click(function () {
        $("#phone").show();
        window.setTimeout(function(){
            $("#phone").addClass('enabled');
        }, 1);
        $("#background").show();
    });

    $("#oComplain").click(function () {
        $("#complain").show();
        window.setTimeout(function(){
            $("#complain").addClass('enabled');
            }, 1);
        $("#background").show();
    });

    $("#infoPage").click(function () {
        $("#details").show();
        window.setTimeout(function(){
            $("#details").addClass('enabled');
        }, 1);
        $("#background").show();
    });
    $("#contactPage").click(function () {
        $("#contact").show();
        window.setTimeout(function(){
            $("#contact").addClass('enabled');
        }, 1);
        $("#background").show();
        GoogleMap.init();
    });
    $("#servicePage").click(function () {
        $("#service").show();
        window.setTimeout(function(){
            $("#service").addClass('enabled');
        }, 1);
        $("#background").show();
    });

    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
});