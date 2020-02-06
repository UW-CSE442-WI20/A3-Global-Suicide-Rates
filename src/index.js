window.onload = start();

import overall_data from '../resources/overall-suicide-rates.json';
import detailed_data from '../resources/detailed-suicide-rates.json';

// set some variables for padding, size, and labels
var outer_width = 1400;
var outer_height = 800;
var margin = { top: 30, right: 30, bottom: 30, left: 60 };
var inner_width = outer_width - margin.left - margin.right;
var inner_height = outer_height - margin.top - margin.bottom;
var circle_radius = 3;
var x_col = "GDP per Capita ($)";
var y_col = "Suicide Rate per 100k People";

// We can prob change the max values later
var x_scale = d3.scaleLinear().domain(0, 60000).range([margin["left"], inner_width]);
var y_scale = d3.scaleLinear().domain(0, 550).range([margin.bottom, inner_height]);

function start() {
    console.log("start");

    // grab the scatter div to put an svg in
    var plot = d3.select("#scatter")
        .append("svg")
        .attr("width", outer_width)
        .attr("height", outer_height);

    // make some axis, still need to append to the plot svg
    var x_axis = d3.axisBottom()
        .scale(x_scale);
    var y_axis = d3.axisLeft()
        .scale(y_scale);

    // plot_by_year(2012);
}

// Takes in a year and groups it for now
function plot_by_year(year) {
    // group by year
    var group_by_year = d3.nest()
        .key(function (d) { return d.year })
        .entries(overall_data);



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
}