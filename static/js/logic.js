// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
// Create the map.
let map = L.map("map", {
    center: [40.76, -111.89],
    zoom: 4
});
// Create a layer
let basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

//add background
basemap.addTo(map);

//Retrieve the data for Earthquakes for the last 7 days from the GeoJson
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){

    //function for Marker color
    function markColor(depth) {
        if (depth > 90) {
            return "#ea2c2c"
        } else if (depth > 70){
            return "#ea822c"
        } else if (depth > 50){
            return "#ee9c00"
        } else if (depth > 30){
            return "#FFFFF0"
        } else if (depth > 10){
            return "#d4ee00"
        } else {
            return "#98ee00"
        }
    }
    //function for Marker Radius
    function markRadius(magnitude){
        if (magnitude === 0) {
            return 1;
        }
        return 3.5 * magnitude
    }

    function styleInfo(feature) {
        return {
            fillOpacity :0.8,
            fillColor: markColor(feature.geometry.coordinates[2]),
            radius: markRadius(feature.properties.mag)
        }
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker((latlng),{ weight: 1});
        },
        style: styleInfo,
        onEachFeature: function (feature,layer){
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag +
                "<br>Depth: " + feature.geometry.coordinates[2] +
                "<br>Location: " + feature.properties.place 
            );
        }
    }).addTo(map);

    //Create Legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            colors = ["#98ee00","#d4ee00","#FFFFF0","#ee9c00","#ea822c","#ea2c2c"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
})
