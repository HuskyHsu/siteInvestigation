let URL = 'https://script.google.com/macros/s/AKfycbwcU5HW37VknYF1BK7BMVO47GQqR6Sw12IHrc9l2WkP95XNSdY/exec'

var app = new Vue({
    el: '#app',
    data: {
        fields: [],
        fieldContent: {},
        ExistingData: getExistingData()
    },
    methods: {
        add: function() {

        },
        edit: function() {

            let m = new Date();
            
            this.fieldContent['調查時間'] = m.getFullYear() +"/"+ (m.getMonth()+1) +"/"+ m.getDate() + " " + m.getHours() + ":" + m.getMinutes() + ":" + m.getSeconds() + " GMT+0800"
             
            let queryStr = 'method=edit&' + this.fields.map((value, index) => {
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
        callupdate: function() {
            getExistingData()
        }
    },
    computed: {

    },
    watch: {
        ExistingData: function (params) {
            ExistingDatalayerGroup.clearLayers();

            var avgLonLat = [0, 0];

            this.ExistingData.forEach(i => {

                let point = L.marker([i["緯度"], i['經度']])
                    .bindPopup(`編號：${i["編號"]}<br> 經緯度：${i["經度"]}, ${i['緯度']}`)
                    .on('click', onPointClick)
                    .addTo(ExistingDatalayerGroup);
      
                if (i["已調查"]) {
                    point._icon.classList.add('sepia');
                }

                function onPointClick() {
                    app.fieldContent = i
                }
                // ExistingDatalayerGroup.addLayer(LG);

                avgLonLat[0] += i["緯度"];
                avgLonLat[1] += i["經度"];
            })

            map.panTo(new L.LatLng(avgLonLat[0]/this.ExistingData.length, avgLonLat[1]/this.ExistingData.length));
        }
    }
})

axios({
    method: 'get',
    url: URL + '?method=getFieldNames',
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


function getExistingData() {
    axios({
        method: 'get',
        url: URL + '?method=getExistingData',
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

// getExistingData();
