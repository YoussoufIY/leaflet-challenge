// We create the tile layer that will be the background of our map.
var basemap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
  {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });
// We create the map object with options.
var map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 5
});
// Then we add our 'basemap' tile layer to the map.
basemap.addTo(map);

geojson="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Here we make an AJAX call that retrieves our earthquake geoJSON data.
d3.json(geojson).then(function (data) {
  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // This function determines the color of the marker based on the depth of the earthquake.
 
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#EA2C2C";
      case depth > 70:
        return "#EA822C";
      case depth > 50:
        return "#EE9C00";
      case depth > 30:
        return "#EECC00";
      case depth > 10:
        return "#D4EE00";
      default:
        return "#98EE00";
    };
  } 
  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(map);
//Add a legend showing the depth and their corresponding color
var legend = L.control({
  position: "bottomright",
 
});
legend.onAdd = function () {
// Create a div with a class attribute "info legend"
var div = L.DomUtil.create("div", "info legend");
// Create a legend title
var legendInfo = "<h1>Earthquake Depth</h1>";
// Add the title to the div
div.innerHTML = legendInfo;

// Create a color scale
var colors = [
  "#98EE00",
  "#D4EE00",
  "#EECC00",
  "#EE9C00",
  "#EA822C",
  "#EA2C2C"
];
// Create a range of depth
var depth = [-10, 10, 30, 50, 70, 90];
var labels =[];

// Create a for Loop that will generate a label with a colored square for each interval and create a rectangle with the corresponding color
for (var i = 0; i < depth.length; i++) {
  
  div.innerHTML +=

    "<li style='background: " + colors[i] + "'></li> " +
// Add the depth range to the label
    depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
}


return div;
};

//the legend color is too wide, adjust the width of the legend



// Add the legend to the map
legend.addTo(map);
});

  
