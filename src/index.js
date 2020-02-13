import overall_data from '../resources/overall-suicide-rates.json';
import detailed_data from '../resources/detailed-suicide-rates.json';

// set some variables for padding, size, and labels
var outer_width = 700;
var outer_height = 455;
var padding = { top: 30, right: 0, bottom: 30, left: 60 };
var inner_width = outer_width - padding.left - padding.right;
var inner_height = outer_height - padding.top - padding.bottom;
var circle_radius = 6;
var x_col = "GDP per Capita ($)";
var y_col = "Suicide Rate per 100k People";

// calculate the x and y scale based on max values of the data
var x_scale = d3.scaleLinear().domain([0, d3.max(overall_data, function (d) { return d["gdp_per_capita ($)"]; })]).range([padding.left, inner_width]);
var y_scale = d3.scaleLinear().domain([0, d3.max(overall_data, function (d) { return d["suicides/100k pop"]; })]).range([inner_height, padding.bottom]);

// prepare/aggregate the data //

// group by year
var group_by_year = d3.nest()
    .key(function (d) { return d.year })
    .entries(overall_data);

console.log("start");

// set up the actual visualization

// grab the scatter div to put an svg in
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", outer_width)
    .attr("height", outer_height);

// make some axis
var x_axis = d3.axisBottom()
    .scale(x_scale);
var y_axis = d3.axisLeft()
    .scale(y_scale);

// put the axis in the div
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (outer_height - padding.top - padding.top) + ")")
    .call(x_axis);
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + ",0)")
    .call(y_axis);

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (outer_height / 2))
    .attr("y", padding.left / 4)
    .style("text-anchor", "middle")
    .text(y_col);
svg.append("text")
    .attr("x", outer_width / 2)
    .attr("y", outer_height - (padding.top / 2))
    .style("text-anchor", "middle")
    .text(x_col);


// Time
// d3.select('p#value-time') for the year
var dataTime = d3.range(0, 20).map(function (d) { return new Date(1995 + d, 10, 3); });

var sliderTime = d3.sliderBottom().min(d3.min(dataTime)).max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365).width(inner_width - padding.left).tickFormat(d3.timeFormat("%Y"))
    .tickValues(dataTime).default(new Date(1995, 10, 3))
    .on("onchange", val => { d3.select("p#value-time").text(d3.timeFormat("%Y")(val)); });


var gTime = d3.select("div#slider-time").append("svg").attr("width", inner_width).attr("height", 47)
    .append("g").attr("transform", "translate(" + padding.left / 4 + ",7)");

gTime.call(sliderTime);
d3.select("p#value-time").text(d3.timeFormat("%Y")(sliderTime.value()));



plot_by_year(svg, 2012);


// Supposed to take in a year and plot the graph
function plot_by_year(svg, year) {

    // console.log(group_by_year);

    // how do I grab data for a year without for looping??
    // var curr_year_data = group_by_year.key[year].values;
    var curr_year_data = {};
    for (var curr_year of group_by_year) {
        if (curr_year.key == year) {
            curr_year_data = curr_year.values;
        }
    }

    let regionList = ["Asia", "Northern Europe", "Western Europe", "Eastern Europe",
                      "Mediterranean", "North America", "Central America and Caribbean", "South America"];

    let colorList = ["#f28e2b", "#76b7b2", "#59a14f", "#e15759",
                     "#edc948", "#4e79a7", "#b07aa1", "#bab0ac"];

    var color = d3.scaleOrdinal()
        .domain(regionList)
        .range(colorList);

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "rgba(255,255,255,0.5)")
        .text("a simple tooltip");

    //Create circles
    svg.selectAll("circle")
        .data(curr_year_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x_scale(d["gdp_per_capita ($)"]);
        })
        .attr("cy", function (d) {
            return y_scale(d["suicides/100k pop"]);
        })
        .attr("r", function (d) {
            return circle_radius;
        })
        .style("fill", function (d) {
            return color(d["Region"]);
        })
        .on("mouseover", function (d, i) { return fade_dots(d, svg, tooltip, this); })
        .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
        .on("mouseout", function () { return unfade_dots(svg, tooltip) });
}

function fade_dots(d, svg, tooltip, i) {
    tooltip.text(d["country"]);

    svg.selectAll("circle").style("opacity", .3);
    d3.select(i).style("opacity", 1);
    return tooltip.style("visibility", "visible");
}

function unfade_dots(svg, tooltip) {
    svg.selectAll("circle").style("opacity", 1);
    return tooltip.style("visibility", "hidden");
}