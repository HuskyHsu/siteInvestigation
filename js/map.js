//WMTS設定
let streets = L.tileLayer('https://mt{s}.google.com/vt/x={x}&y={y}&z={z}&hl=zh-TW', {
    id: 'streets',
    subdomains: "012",
    attribution: 'Map data: &copy; Google'
});

let satellite = L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    id: 'topography',
    subdomains: "012",
    attribution: 'Map data: &copy; Google'
});

let map = L.map('map', {
            layers : [streets]
        }).setView([25.04, 121.56], 16);

//群組
let baseMaps = {
    "Google地圖": streets,
    "Google衛星影像": satellite
};


L.control.layers(baseMaps).addTo(map);

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    // var loction = L.marker(e.latlng).addTo(map);
    // loction._icon.classList.add('location');

    L.circle(e.latlng, 10).addTo(map);

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    console.log(e.message);
}

map.on('locationerror', onLocationError);

let ExistingDatalayerGroup = L.layerGroup([]).addTo(map);