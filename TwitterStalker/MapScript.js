let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.776, lng: -96.797},
        zoom: 10
    });

    let home;
    home = new google.maps.Marker({
        position: {lat: 32.9608558, lng: -96.8530005},
        map: map,
        title: 'Home'
    });

    let globe_runnner;
    globe_runnner = new google.maps.Marker({
        position: {lat: 32.972469, lng: -96.830857},
        map: map,
        title: 'Globe Runner'
    });

    let unifocus;
    unifocus = new google.maps.Marker({
        position: {lat: 32.9194354, lng: -96.9292158},
        map: map,
        title: 'Globe Runner'
    });
}

initMap();
