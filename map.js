// retrieve user input ?1=on&2=on&3=on
var query = window.location.search;
// Skip the leading ? and last =on
query = query.substring(1, query.lastIndexOf("="));
// split into list
var userInput = query.split('=on&'); 

//colours
var c = new Object();
c.climate = "#364C5A";
c.water = "#3BB2E5";
c.animal = "#f39c12";
c.health = "#8e44ad";
c.land = "#7BBC10";
c.food = "#8C1C1C";

//Width and height of map
var wInfo = 250
var wMap = 1000;
var h = 600

// Select info div by ID
var mapDiv, infoDiv;
mapDiv = d3.select("#mapDiv");
infoDiv = d3.select("#infoDiv");
linkDiv = d3.select("#linkDiv");


//Define map projection

// **BK**
//now using Mollweide equal area projection
var projection = d3.geo.mollweide()
		.scale(220)
		.translate([ (wMap /2)-50, h / 2 ]);
// **BK**
            
//Define default path generator
var path = d3.geo.path()
  .projection(projection);

//Create SVG element
var svg = d3.select("#mapDiv")
  .append("svg")
  .attr("width", wMap)
  .attr("height", h)

showInfobox(0, 0, 0, 0, 0);

// **BK**
//Load in TopoJSON data
d3.json("world-110m.json", function(json) {

// **BK**
//now using TopoJSOn file and paths
//Bind data and create one path per TopoJSON feature
svg.append("path")
  .datum(topojson.feature(json, json.objects.countries))
  .attr("d", path)
  .style("fill", "#e6e6e6")
  .style("stroke", "#cccccc");

// Click on map to go back to standard screen
d3.select("#mapDiv").on("click", function(d) {
         showInfobox(0, 0, 0, 0, 0);
         showLink(0, 0, 0, 0);
   });

// Load in csv data (Locations + Info)
d3.csv("meatdata.csv", function(data) {
  data = data.filter(function(row) {
    if (userInput == "") {return true}
    else {return row["type"] == userInput[0] || row["type"] == userInput[1] || row["type"] == userInput[2]}
  });
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
       return projection([d.lon, d.lat])[0];
    })
    .attr("cy", function(d) {
       return projection([d.lon, d.lat])[1];
    })
    .attr("r", "17")
    .style("fill", function(d) {
      return c[d.type];
    })
    .style("opacity", "0.75")
    .on("mouseover", function() {
        d3.select(this)
          .transition()
          .attr("r", "22")
          .style("opacity", "1")    
    })
    .on("mouseout", function() {
        d3.select(this)
          .transition()
          .attr("r", "17")
          .style("opacity", "0.75");
    })
    .on("click", function(d) {
          var title = d.location;
          var category = d.category;
          var info = d.info;
          var colour = c[d.type];
          var type = d.type;
          var reference = d.reference;
          showInfobox(title, category, info, colour, reference, 1);
          showLink(colour, type, category, 1);
          d3.event.stopPropagation();
    });
});
});
      
function showInfobox(place, subtitle, text, colour, reference, on) {
  if (on == 1) {
//    d3.select("#infoDiv").style("background-color", colour);
    d3.select("#infoDiv").html("<h1 style=\"color: " + colour + "\">" + place + "</h1><h2 style=\"color: " + colour + "\">" + subtitle + "</h2><br>" + text + "<br><a href='" + reference + "' target='_blank'>[SOURCE]</a>");
  }
  else {
    d3.select("#infoDiv").html("<h1>Click on a dot!</h1>");
  }
}

function showLink(colour, type, category, on) {
  if (on == 1) {
    d3.select("#linkDiv")
      .style("background-color", colour)
      .attr("href", "info/" + type + ".html");
    linkDiv.html("Learn more about<br><b>" + category + "</b>");
  }
  else {
    d3.select("#linkDiv")
      .style("opacity", "1");
  }
}

// rank,location,lat,lon,type,category,info
