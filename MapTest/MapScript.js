window.onload = function(){initMap();};

function initMap() {
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.9608558, lng: -96.8530005},
        zoom: 13
    });

    // let home = new google.maps.Marker({
    //     position: {lat: 32.9608558, lng: -96.8530005},
    //     map: map,
    //     title: 'Home'
    // });
    //
    // let globe_runnner= new google.maps.Marker({
    //     position: {lat: 32.972469, lng: -96.830857},
    //     map: map,
    //     title: 'Globe Runner'
    // });

    directionsDisplay.setMap(map);
    document.getElementById('submit').addEventListener('click', function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay){
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            let route = response.routes[0];
            let summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (let i = 0; i < route.legs.length; i++) {
                let routeSegment = i + 1;
                summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                    '</b><br>';
                summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
