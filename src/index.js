import overall_data from '../resources/overall-suicide-rates.json';
import detailed_data from '../resources/detailed-suicide-rates.json';

// set some variables for padding, size, and labels
var outer_width = 1000;
var outer_height = 450;
var padding = { top: 30, right: 30, bottom: 30, left: 60 };
var inner_width = outer_width - padding.left - padding.right;
var inner_height = outer_height - padding.top - padding.bottom;
var circle_radius = 3;
var x_col = "GDP per Capita ($)";
var y_col = "Suicide Rate per 100k People";

// calculate the x and y scale based on max values of the data
var x_scale = d3.scaleLinear().domain([0, d3.max(overall_data, function (d) { return d["gdp_per_capita ($)"]; })]).range([padding.left, inner_width]);
var y_scale = d3.scaleLinear().domain([0, d3.max(overall_data, function (d) { return d["suicides/100k pop"]; })]).range([inner_height + padding.top, padding.bottom]);

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
    .attr("transform", "translate(0," + (outer_height - padding.top) + ")")
    .call(x_axis);
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + ",0)")
    .call(y_axis);

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (padding.right / 2))
    .attr("x", 0 - (outer_height / 2))
    .text(y_col);

svg.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", 100)
    .attr("x", 100)
    .text(y_col);

svg.append("text")
    .attr("x", outer_width / 2)
    .attr("y", outer_height + padding.bottom)
    .style("text-anchor", "middle")
    .text(x_col);

// y = -15, -225


plot_by_year(svg, 2012);


// Supposed to take in a year and plot the graph
function plot_by_year(svg, year) {

    console.log(group_by_year);

    // how do I grab data for a year without for looping??
    // var curr_year_data = group_by_year.key[year].values;
    var curr_year_data = {};
    for (var curr_year of group_by_year) {
        if (curr_year.key == year) {
            curr_year_data = curr_year.values;
        }
    }
    console.log(curr_year_data);


    //Create circles
    svg.selectAll("circle")
        .data(curr_year_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            console.log(d["gdp_per_capita ($)"])
            return x_scale(d["gdp_per_capita ($)"]);
        })
        .attr("cy", function (d) {
            return y_scale(d["suicides/100k pop"]);
        })
        .attr("r", function (d) {
            return circle_radius;
        });
}