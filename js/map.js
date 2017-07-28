//WMTS設定
let streets = L.tileLayer('https://mt{s}.google.com/vt/x={x}&y={y}&z={z}&hl=zh-TW', {
    id: 'streets',
    subdomains: "012",
    // attribution: 'Map data: &copy; Google'
});

let satellite = L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    id: 'topography',
    subdomains: "012",
    // attribution: 'Map data: &copy; Google'
});

let map = L.map('map', {
            layers : [streets]
        }).setView([25.04, 121.56], 16);

//群組
let baseMaps = {
    "Google地圖": streets,
    "Google衛星影像": satellite
};

let manIconImg = ['exercising-woman.png',
                  'happy-man.png',
                  'man-exercising-with-arm-raised.png',
                  'man-listening-to-music.png',
                  'man-singing.png',
                  'man-standing-up.png',
                  'man-waving-arm.png',
                  'man-with-two-balloons.png',
                  'running-man.png']

let manIcon = manIconImg.map(function (params) {
    return L.icon({
        iconUrl: 'png/smallPeople/' + params,
        iconSize: [32, 32],
        iconAnchor: [16, 30]
    })
})


L.control.layers(baseMaps).addTo(map);

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    // var loction = L.marker(e.latlng).addTo(map);
    // loction._icon.classList.add('location');
    // L.circle(e.latlng, 10).addTo(map);
    L.circle(e.latlng, radius).addTo(map);
    L.marker(e.latlng, {icon: manIcon[parseInt((Math.random() * manIcon.length))]}).addTo(map);

    app.GPSLocation = e.latlng
    map.GPSLocation.textContent = `GPS定位：Lon:${e.latlng.lng.toFixed(6)}, Lat:${e.latlng.lat.toFixed(6)}`;
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    console.log(e.message);
}

map.on('locationerror', onLocationError);

let ExistingDatalayerGroup = L.layerGroup([]).addTo(map);

let Location = L.Control.extend({

    options: {position: 'bottomleft'},

    onAdd: function (map) {
        let div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        map.GPSLocation = L.DomUtil.create('p', 'GPSLocation');
        map.mapCenterLocation = L.DomUtil.create('p', 'mapCenterLocation');

        map.GPSLocation.textContent = `GPS定位：Lon:${map.getCenter().lng.toFixed(6)}, Lat:${map.getCenter().lat.toFixed(6)}`;
        map.mapCenterLocation.textContent = `地圖中心：Lon:${map.getCenter().lng.toFixed(6)}, Lat:${map.getCenter().lat.toFixed(6)}`;

        div.appendChild(map.GPSLocation);
        div.appendChild(map.mapCenterLocation);

        return div;
    }
});
map.addControl(new Location());

let Update = L.Control.extend({

    options: {position: 'topright'},

    onAdd: function (map) {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = "url(png/refresh-button.png)";
        container.style.backgroundSize = "44px 44px";
        container.style.width = '44px';
        container.style.height = '44px';

        container.onclick = function () {getExistingData();}

        return container;
    }
});
map.addControl(new Update());

// let Compass = L.Control.extend({

//     options: {position: 'topright'},

//     onAdd: function (map) {
//         let compass = L.DomUtil.create('div', 'compass leaflet-bar leaflet-control leaflet-control-custom');

//         compass.style.backgroundColor = 'white';
//         compass.style.backgroundImage = "url(png/compass.png)";
//         compass.style.backgroundSize = "40px 40px";
//         compass.style.width = '44px';
//         compass.style.height = '44px';

//         if(window.DeviceOrientationEvent) {
        
//           window.addEventListener('deviceorientation', function(event) {
//                 let alpha;
//                 //     判斷是否為 iOS 裝置
//                 if(event.webkitCompassHeading) {
//                   alpha = event.webkitCompassHeading; // iOS 裝置必須使用 event.webkitCompassHeading
//                   compass.style.WebkitTransform = 'rotate(-' + alpha + 'deg)';
//                 }
//                 else {
//                   alpha = event.alpha;
//                   alpha = alpha - 90;
//                   if(!window.chrome) {
//                     alpha = alpha - 90;
//                   }
//                 }
            
//                 compass.style.Transform = 'rotate(' + alpha + 'deg)';

//               }, false);
//         }else{
//           document.querySelector('body').innerHTML = '你的瀏覽器不支援喔';
//         }

//         return compass;
//     }
// });
// map.addControl(new Compass());

map.on("moveend", function () {
    map.mapCenterLocation.textContent = `地圖中心：Lon:${map.getCenter().lng.toFixed(6)}, Lat:${map.getCenter().lat.toFixed(6)}`;
});

let centerMarker = L.DomUtil.create('div', 'centerMarker');
centerMarker.textContent = "＋"
document.getElementById('map').appendChild(centerMarker);