let spreadsheetsID = encodeURIComponent(new URLSearchParams(window.location.search).get('spreadsheetsID'));
let spreadsheetsName = encodeURIComponent(new URLSearchParams(window.location.search).get('spreadsheetsName'));
let driveFolderID = encodeURIComponent(new URLSearchParams(window.location.search).get('driveFolderID'));

let errCount = 0;

if (spreadsheetsID == 'null'){
    spreadsheetsID = prompt("請提供google算表ID", "1AvxWdDXf4xmV8sW9to9HspmcgsRoRUfhYRZks6-iEdE");
    spreadsheetsID = encodeURIComponent(spreadsheetsID);
    errCount += 1;
}

if (spreadsheetsName == 'null'){
    spreadsheetsName = prompt("請提供工作表名稱", "工作表1");
    spreadsheetsName = encodeURIComponent(spreadsheetsName);
    errCount += 1;
}

if (driveFolderID == 'null'){
    driveFolderID = prompt("請提供Google drive ID", "0BzccTlxkvzijX3hpcW10N3BhYUE");
    driveFolderID = encodeURIComponent(driveFolderID);
    errCount += 1;
}

let spreadsheets = `spreadsheetsID=${spreadsheetsID}&spreadsheetsName=${spreadsheetsName}&driveFolderID=${driveFolderID}`;

if (errCount > 0){
    window.location = window.location.pathname + '?' + spreadsheets;
}

let URL = 'https://script.google.com/macros/s/AKfycbwyLhi5JLkkmFaqCpKUDbysecLBCxzgY-YO8ONSkL0gEVjfcJM/exec';

var app = new Vue({
    el: '#app',
    data: {
        fields: [],
        fieldContent: {},
        ExistingData: getExistingData(),
        GPSLocation: {},
        picked: 'GPS'
    },
    methods: {
        //新增點位
        add: function() {

            let LatLng = {};
            if (this.picked == 'GPS'){
                LatLng = this.GPSLocation;
            }
            else {
                LatLng = map.getCenter();
            }

            let m = new Date();

            this.fieldContent['緯度'] = LatLng.lat;
            this.fieldContent['經度'] = LatLng.lng;

            let TWD97 = WGS84toTWD97(LatLng);
            this.fieldContent['TWD97_X'] = TWD97.x;
            this.fieldContent['TWD97_Y'] = TWD97.y;
                        
            this.fieldContent['調查時間'] = m.getFullYear() +"/"+ (m.getMonth()+1) +"/"+ m.getDate() + " " + m.getHours() + ":" + m.getMinutes() + ":" + m.getSeconds() + " GMT+0800"
             
            let queryStr = `${spreadsheets}&method=PostAdd&` + this.fields.map((value, index) => {
                if (value.fieldName == '編號') {
                    return ''
                }
	            return encodeURIComponent(value.fieldName) + '=' + encodeURIComponent(this.fieldContent[value.fieldName])
            }).join('&');

            queryStr = queryStr.replace("&&", "&");

			//Axios
			axios({
                method:'post',
                url: URL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
			    },
                data: queryStr
			}).then(function(response) {
                getExistingData();
                alert(response.data);
			});

        },
        //修正資料
        edit: function() {

            let m = new Date();
            
            this.fieldContent['調查時間'] = m.getFullYear() +"/"+ (m.getMonth()+1) +"/"+ m.getDate() + " " + m.getHours() + ":" + m.getMinutes() + ":" + m.getSeconds() + " GMT+0800"
            
            let TWD97 = WGS84toTWD97({lng: this.fieldContent['經度'], lat: this.fieldContent['緯度']});
            this.fieldContent['TWD97_X'] = TWD97.x;
            this.fieldContent['TWD97_Y'] = TWD97.y;

            let queryStr = `${spreadsheets}&method=PostEdit&` + this.fields.map((value, index) => {
	            return encodeURIComponent(value.fieldName) + '=' + encodeURIComponent(this.fieldContent[value.fieldName])
            }).join('&');

			//Axios
			axios({
                method:'post',
                url: URL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
			    },
                data: queryStr
			}).then(function(response) {
                getExistingData();
                alert(response.data);
			});
            
        },
        //修正座標
        updateLocation: function () {
            let LatLng = {};
            if (this.picked == 'GPS'){
                LatLng = this.GPSLocation;
            }
            else {
                LatLng = map.getCenter();
            }

            this.fieldContent['緯度'] = LatLng.lat;
            this.fieldContent['經度'] = LatLng.lng;

            let TWD97 = WGS84toTWD97(LatLng);
            this.fieldContent['TWD97_X'] = TWD97.x;
            this.fieldContent['TWD97_Y'] = TWD97.y;
        },
        //刪除此點
        deleteThis: function() {
           
            let deleteID = this.fieldContent['編號'];
            let queryStr = `${spreadsheets}&method=PostDelete&DeleteID=` + encodeURIComponent(deleteID)

			//Axios
			axios({
                method:'post',
                url: URL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
			    },
                data: queryStr
			}).then(function(response) {
                getExistingData();
                alert(response.data);
			});

        },
        //檔案變更
        fileChange: function (e) {
            let file = e.target.files || e.dataTransfer.files;
            let fileName = file[0].name;
            let fileType = file[0].type;
            let fr = new FileReader();

            fr.onload = (e) => {
                let fileBase64Code = e.target.result.replace(/^.*,/, '')
                this.fieldContent['照片名稱'] = `driveFolderID=${driveFolderID}&fileName=${fileName}&fileBase64Code=${fileBase64Code}`
                
            }
            fr.readAsDataURL(file[0]);
        }
    },
    computed: {
        fileName: function() {
            let tem = this.fieldContent['照片名稱'].split("&")
            return tem.length > 1 ? tem[1].replace('fileName=', '') : (tem[0] == '' ? '請上傳檔案' : tem[0])
        }
    },
    watch: {
        //自動更新畫面
        ExistingData: function (params) {
            ExistingDatalayerGroup.clearLayers();

            var avgLonLat = [0, 0];

            if (this.ExistingData.length == 0){
                // map.panTo(this.GPSLocation);
                return 0
            }

            this.ExistingData.forEach(i => {

                // let googleNavigation = `https://www.google.com.tw/maps/dir/${i["緯度"]},${i['經度']}/${this.GPSLocation.lat},${this.GPSLocation.lng}/@24,120.5,10z/data=!3m1!4b1!4m2!4m1!3e0`;
                let googleNavigation = navigation(i["緯度"] + ',' + i["經度"], this.GPSLocation.lat + ',' + this.GPSLocation.lng)

                let point = L.marker([i["緯度"], i['經度']])
                    .bindPopup(`編號：${i["編號"]}<br><a href=${googleNavigation} target="_blank">google導航</a>`)
                    // .on('click', onPointClick)
                    .on('click', function clickZoom(e) {
                        app.fieldContent = i;
                        map.setView(e.target.getLatLng(), 18);

                        ExistingDatalayerGroup.eachLayer(function(Layer) {
                            Layer._icon.classList.remove('focusMarker');
                        })

                        e.target._icon.classList.add('focusMarker');
                    })
                    .addTo(ExistingDatalayerGroup);
      

                if (i["已調查"]) {
                    point._icon.classList.add('sepia');
                }

                // function onPointClick() {
                //     app.fieldContent = i
                // }
                // ExistingDatalayerGroup.addLayer(LG);

                avgLonLat[0] += i["緯度"];
                avgLonLat[1] += i["經度"];
            })

            map.panTo(new L.LatLng(avgLonLat[0]/this.ExistingData.length, avgLonLat[1]/this.ExistingData.length));
        }
    }
})

//取的欄位
axios({
    method: 'get',
    url: `${URL}?${spreadsheets}&method=getFieldNames`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(function (response) {

    let fields = response.data
    app.fields = fields;
    let fieldContent = {};
    fields.forEach(function (field) {

        if (field.fieldType == 'number'){
            fieldContent[field.fieldName] = 0
        } else if (field.fieldType == 'checkbox'){
            fieldContent[field.fieldName] = false
        } else {
            fieldContent[field.fieldName] = ''
        }
    })
    app.fieldContent = fieldContent;

});

//取得圖資
axios({
    method: 'get',
    url: `${URL}?${spreadsheets}&method=getMapData`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(function (response) {

    let mapData = response.data

    mapData.forEach(function (element) {

        let onEachFeature = (function (showName) {
            return function (feature, layer) {
                if (feature.properties && feature.properties[showName]) {
                    layer.bindPopup(feature.properties[showName]);
                }
            }
        })(element.showName);

        if (element.geojson[0].geometry.type !== "Point"){
            L.geoJSON(element.geojson, {
                onEachFeature: onEachFeature,
                style: element.style
            }).addTo(map);

        }
        else {

            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: element.style.fillColor,
                color: element.style.color,
                weight: 1,
                opacity: 0.7,
                fillOpacity: 0.8
            };
            
            L.geoJSON(element.geojson, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
        }

    });
});

//更新數據
function getExistingData() {
    axios({
        method: 'get',
        url: `${URL}?${spreadsheets}&method=getExistingData`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response) {

        response.data.forEach((value, index) => {
            response.data[index]['調查時間'] = new Date( value['調查時間'] )
        })
        
        app.ExistingData = response.data;
    });
}

//座標轉換
function WGS84toTWD97(params) {

    let WGS84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
    let TWD97 = "+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    
    let newLoction = proj4(WGS84, TWD97, [params.lng, params.lat])
    
    return {x: newLoction[0].toFixed(2), y: newLoction[1].toFixed(2)}
    
}

//導航連結
function navigation(LngLat, GPSLocation) {
	if (navigator.userAgent.match(/android/i)) {
		return "google.navigation:q=" + LngLat + "&mode=d"
	} else if(GPSLocation == 'undefined,undefined') {
        return "http://maps.google.com?q=" + LngLat
    } else {
		if (navigator.userAgent.match(/(iphone|ipod|ipad);?/i)) {
			return "comgooglemaps://?saddr=&daddr=" + LngLat + "&directionsmode=Driving&zoom=15"
		} else {
            return 'https://www.google.com.tw/maps/dir/' + LngLat + '/' + GPSLocation + '/@24,120.5,10z/data=!3m1!4b1!4m2!4m1!3e0'           
		}
	};
	return ""
}

setTimeout(function(){ 
    screenfull.toggle(); 
}, 3000);
