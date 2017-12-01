var map;

function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 14
    };
    var html_element = document.getElementById("googleMap");
    map = new google.maps.Map(html_element, mapProp);
    var point = new google.maps.LatLng(50.464379, 30.519131);
    var marker = new google.maps.Marker({
        position: point,
//map - це змінна карти створена за допомогою new google.maps.Map(...)
        map: map
    });
//Карта створена і показана
}

exports.init=initialize;