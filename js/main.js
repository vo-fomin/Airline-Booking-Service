var $logo=$("#logo");
var $context;

$logo.mouseover(function(){
    $logo.prop("src", "images/Logo.gif");
});
$logo.mouseout(function(){
    $logo.prop("src", "images/Logo2.png");
});
$logo.click(function(){
    location.reload();
});
$("#mainPage").click(function(){
    location.reload();
});

$(".close").click(function(){
    $("#book").hide();
    $("#phone").hide();
    $("#complain").hide();
    $("#contact").hide();
    $("#details").hide();
    $("#service").hide();
    $("#background").hide();
});

$("#oBook").click(function(){
    $("#book").show();
    $("#background").show();
    $context=document.getElementById('plane').getContext('2d');
    $context.drawImage(document.getElementById('scheme'), -600, 0, 2650, 1200);
    $context.roundRect(580, 210, 60, 40, 6).stroke();
    $context.roundRect(650, 210, 60, 40, 6).stroke();
    $context.roundRect(740, 210, 60, 40, 6).stroke();
    $context.roundRect(810, 210, 60, 40, 6).stroke();
});

$("#oPhone").click(function(){
    $("#phone").show();
    $("#background").show();
});

$("#oComplain").click(function(){
    $("#complain").show();
    $("#background").show();
});

$("#infoPage").click(function(){
    $("#details").show();
    $("#background").show();
});
$("#contactPage").click(function(){
    $("#contact").show();
    $("#background").show();
});
$("#servicePage").click(function(){
    $("#service").show();
    $("#background").show();
});

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
}