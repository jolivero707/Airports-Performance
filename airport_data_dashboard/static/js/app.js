// Creating map object
const API_KEY = "pk.eyJ1IjoiandvaDEzMjMiLCJhIjoiY2p0bGw5MmV5MDduYzQ0bGJhd2czamRmNyJ9.1zN6LD4MMEaOubjEcpkbNA";



function SelectAirportSize(data) {
    if (data === "large_airport") {
       return 50000
    }
    else if (data === "medium_airport"){
       return 30000
    }
    else {
      return 10000
    }
};

  function SelectAirportColor(data) {
    if (data === "large_airport") {
      return '#9DFF33'
    }
    else if (data === "medium_airport"){
      return '#F9FF33'
    }
    else {
      return '#FF8333'
    }
  };

function Updateyear(year) {
  if (year == 2017) {
     return "2017"
  }
  else if (year == 2018) {
    return "2018"
  }
};

//let line_layer;

let map = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 4.4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY,
}).addTo(map);


//var group = new L.FeatureGroup();
//var coordinates = [];

function get_route(airport_name){
    var url = "/routes/"+airport_name
    d3.json(url, function(info)
    {
      var coordinates = []
      for (var i = 0; i < info.length; i++)
      {
        var origin = [];
        var dest = [];
        origin.push(info[i].orgin_lat);
        origin.push(info[i].orgin_long);
        dest.push(info[i].des_lat);
        dest.push(info[i].des_long);
        coordinates.push(origin,dest);
      }
      //var line_layer = new L.FeatureGroup();
      L.polygon(coordinates,{
        color:'black',
        weight:0.3
      }).addTo(map).on('click',function(){
        map.removeLayer(this);
      })
      
      //group.addLayer(route_layer); 
      //map.addLayer(group);
      //map.removeLayer(line_layer);
    })};



d3.json("/tooltip", (data) => {
  for (let i = 0; i < data.length; i++) {
  var circlesGroup = L.circle([data[i].latitude, data[i].longitude], {
                            fillOpacity: 0.7,
                            color: "black",
                            weight: 0.4,
                            fillColor: SelectAirportColor(data[i].type),
                            radius: SelectAirportSize(data[i].type)
                          }).bindPopup("<h4>" + data[i].name + "</h4>" + 
                          "<hr>" + "<strong>Municipality</strong>: " + data[i].municipality +
                          "<br>" + "<strong>Elevation:</strong> " + data[i].elevation + "<br>" +
                          "<strong>Latitude</strong>: " + data[i].latitude +
                           "<br>" + "<strong>Longitude</strong>: " +data[i].longitude + 
                           "<br>" + "<strong>Home Link</strong>: " + data[i].home_link + "<br>"
                          + "<p>" + data[i].iata_code + "</p>").addTo(map);

L.featureGroup([circlesGroup])
.on('click', () => {
  //map.removeLayer(group);
  var airport_code = d3.select("p").text()
  var url = "/airports/" + airport_code;
  get_route(airport_code);
  d3.json(url, function(info){
      var year = d3.select("#selDataset").property("value")
      var info = info.filter((info) => info.Year == Updateyear(year))
      var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      var trace1 = {
        x: month,
        y: info.map(row => row.Aircraft_Delay),
        type: "lines",
        name: "Aircraft"
      };

      var trace2 = {
        x: month,
        y: info.map(row => row.Carrier_Delay),
        type: "lines",
        name: "Carrier"
      };

      var trace3 = {
        x: month,
        y: info.map(row => row.Weather_Delay),
        type: "lines",
        name: "Weather"
      };

      var trace4 = {
        x: month,
        y: info.map(row => row.NAS_Delay),
        type: "lines",
        name: "NAS"
      };

      var trace5 = {
        x: month,
        y: info.map(row => row.Security_Delay),
        type: "lines",
        name: "Security"
      };


      data = [trace1, trace2, trace3, trace4, trace5];

      var layout = {
        title: "Delay Reasons",
        xaxis:{
          title: 'Month',
          tickangle: -45
        },
        yaxis:{
          title: 'Total Mins'
        },
        autosize: false,
        width: 400,
        height: 300,
        margin: {
          l: 50,
          r: 50,
          t: 40,
          b: 100
        }
      };
      
      Plotly.newPlot("line", data, layout);

  //Departure and Arrival Delay Chart 
      var trace6 = {
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        y: info.map(row => row.Depart_Delay),
        type: "bar",
        name: "Depart"
      };


      var trace7 = {
        //x: info.map(row => row.Month),
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        y: info.map(row => row.Arrival_Delay),
        type: "bar",
        name: "Arrival"
      };
    
      data2 = [trace6, trace7];

      var layout2 = {
        title: "Depart & Arrival Delay",
        autosize: false,
        xaxis:{
          title: 'Month',
          tickangle: -45
        },
        width: 400,
        height: 270,
        margin: {
          l: 50,
          r: 50,
          t: 40,
          b: 100
        }
      };

      Plotly.newPlot("line2", data2, layout2);
    });});

//Call get route 
            
  };

});

var legend = L.control({position: 'topleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = ["large_airport", "medium_airport", "small_airport"],
        labels = []

    for (var i = 0; i < grades.length; i++) {
        grades[i];
        labels.push(
            '<i style="background:' + SelectAirportColor(grades[i]) + '"></i> ' + 
            grades[i]);
    }

    div.innerHTML = labels.join("<br>");
    return div;
};

legend.addTo(map);

