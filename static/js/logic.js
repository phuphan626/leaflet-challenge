// Creating map object
var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 2
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store API query variables. The all month dataset for past 30 days
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// Create the url
var url = baseURL;
// Create the radius function
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
};
//  GET color radius call to the URL
d3.json(url, function(data) {
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };
    // set different color from magnitude
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea822c";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    };
    // GeoJSON layer
    L.geoJson(data, {
        // Make cricles
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // circles style
        style: styleInfo,
        // popup for each marker
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);
    // Create legend
    var legend = L.control({
        position: "bottomright"
    });
    // Adding details for the legend
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var magnitude = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];
        // Looping through the magnitude array to add to legend
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
        }
        return div;
    };
    // Adding legend to the map
    legend.addTo(myMap);
});