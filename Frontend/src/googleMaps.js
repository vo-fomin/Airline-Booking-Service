var map;

function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(50.454379, 30.519131),
        zoom: 10
    };
    var html_element = document.getElementById("googleMap");
    map = new google.maps.Map(html_element, mapProp);
    var arrayPoints=[
        new google.maps.LatLng(50.444379, 30.519131),
        new google.maps.LatLng(50.504379, 30.499931),
        new google.maps.LatLng(50.402379, 30.635131)
    ];
    var arrayMarkers=[
        new google.maps.Marker({
        position: arrayPoints[0],
        map: map
        }),
        new google.maps.Marker({
            position: arrayPoints[1],
            map: map
        }),
        new google.maps.Marker({
            position: arrayPoints[2],
            map: map
        })
    ];
}

exports.init=initialize;