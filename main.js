import { partidosFunction, colorScaleFunction, personFunction } from './card.js';
import { mouseLeaveFunction, mouseOverFunction, zoomFunction } from './events.js';

fetch('./servel2.json')
.then(response => response.json())
.then(data => graph_data(data))
.catch(error => console.log(error));

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/scatterplot
function Scatterplot(data, {
    x = ([x]) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    r = 2, // (fixed) radius of dots, in pixels
    title, // given d in data, returns the title
    marginTop = 40, // top margin, in pixels
    marginRight = 40, // right margin, in pixels
    marginBottom = 40, // bottom margin, in pixels
    marginLeft = 70, // left margin, in pixels
    inset = 0, // inset the default range, in pixels
    insetTop = 0, // inset the default y-range
    insetRight = 0, // inset the default x-range
    insetBottom = 0, // inset the default y-range
    insetLeft = 0, // inset the default x-range
    width = 1096, // outer width, in pixels
    height = 720, // outer height, in pixels
    xType = d3.scaleLog, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft + insetLeft, width - marginRight - insetRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
    xLabel, // a label for the x-axis
    yLabel, // a label for the y-axis
    xFormat, // a format specifier string for the x-axis
    yFormat // a format specifier string for the y-axis
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const T = title == null ? null : d3.map(data, title);
    const I = d3.range(X.length).filter(i => !isNaN(X[i]) && !isNaN(Y[i]));

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = d3.extent(Y);
  
    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 100, xFormat);
    const yAxis = d3.axisLeft(yScale).ticks(height / 100, yFormat);
  
    // Create SVG
    const svg = d3.select("#my-chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add a clipPath: everything out of this area won't be drawn.
    svg.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", marginLeft)
      .attr("y", -marginBottom);
    
    // Create the scatter variable: where both the circles and the brush take place
    var scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")
    
    // Add x-axis
    var xAxiss = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", marginTop + marginBottom - height)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .style("font-size", "1.5em")
            .text(xLabel));
            
    // Add y-axis
    var yAxiss = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", 0)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .style("font-size", "1.5em")
            .text(yLabel));

    // Add tooltip 
    var tooltip = d3.select("#my-chart")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

    // Zoom
    var zoom = d3.zoom()
        .scaleExtent([0.5, 15])
        .on('zoom', function(event, i){
          zoomFunction(event, i, svg, xScale, yScale, xAxiss, yAxiss)
        })
    svg.call(zoom)

    //
    const partidos = partidosFunction(data)
    const colorScale = colorScaleFunction(partidos)

    // Add circles
    scatter
      .append("g")
      .selectAll("circle")
      .data(I)
      .enter()
      .append("circle")
        .attr("class", function (d) { return "dot " + partidos.get(data[d]['data']['partido'])})
        .attr("cx", i => xScale(X[i]))
        .attr("cy", i => yScale(Y[i]))
        .attr("r", r*2)
        .style("fill", d => colorScale(d))
        .style("opacity", 0.7)
        .style("stroke", "white")
      .on("mouseover", function(event, i){
        mouseOverFunction(event, i, partidos, data, tooltip, svg, colorScale, r)
      })
      .on("mouseleave", function(event, i){
        mouseLeaveFunction(event, i, partidos, data, tooltip, r)
      })
      .on("click", function(event, i){
        personFunction(event, i, data)
      })    

    return svg.node();
  }

function graph_data(data){
    var names = Object.keys(data['CONVENCIONAL CONSTITUYENTE'])
    var persons = names.map(
        x => { 
            return {
                name: x,
                "data": data['CONVENCIONAL CONSTITUYENTE'][x]
            } 
        }
    )
    .filter(x => x.data.votos > 10)
    var chart = Scatterplot(persons, {
        xtype: d3.scaleLog,
        yType: d3.scaleLog,
        x: d => d.data.ingreso_total != "0" ? parseInt(d.data.ingreso_total) : 1,
        y: d => d.data.votos != "" ? d.data.votos : 1,
        title: d => d.data.votos,
        xLabel: "Ingreso total ($)",
        yLabel: "Votos",
        stroke: "steelblue"
        })
}