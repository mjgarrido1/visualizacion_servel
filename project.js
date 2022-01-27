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
    yFormat, // a format specifier string for the y-axis
    fill = "none", // fill color for dots
    stroke = "currentColor", // stroke color for the dots
    strokeWidth = 1.5, // stroke width for dots
    halo = "#fff", // color of label halo 
    haloWidth = 3 // padding around the labels
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
  
    const svg = d3.select("#my-chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    
    // Add x-axis
    svg.append("g")
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
            .text(xLabel));
            
    // Add y-axis
    svg.append("g")
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
            .text(yLabel));
  
    // Add votos label a los dots
    // if (T) svg.append("g")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10)
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-linecap", "round")
    //   .selectAll("text")
    //   .data(I)
    //   .join("text")
    //     .attr("dx", 7)
    //     .attr("dy", "0.35em")
    //     .attr("x", i => xScale(X[i]))
    //     .attr("y", i => yScale(Y[i]))
    //     .text(i => T[i])
    //     .call(text => text.clone(true))
    //     .attr("fill", "none")
    //     .attr("stroke", halo)
    //     .attr("stroke-width", haloWidth);

    var tooltip = d3.select("#my-chart")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
    

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    const mouseover = function(event, i) {
      d3.select(this).transition()
        .duration('100')
        .attr("r", r*2 + 1)
      tooltip
        .style("opacity", 1)
        .style("left", (d3.pointer(event, svg)[0])+5 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.pointer(event, svg)[1])-25 + "px")
        .html(data[i]['name'])
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(d, i) {
      d3.select(this).transition()
        .duration('100')
        .attr("r", r*2)
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }

    // Add dots
    svg.append("g")
      .selectAll("dot")
      .data(I)
      .enter()
      .append("circle")
        .attr("cx", i => xScale(X[i]))
        .attr("cy", i => yScale(Y[i]))
        .attr("r", r*2)
        .style("fill", "#69b3a2")
        .style("opacity", 0.7)
        .style("stroke", "white")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)

      

      //   .attr("fill", fill)
      //   .attr("stroke", stroke)
      //   .attr("stroke-width", strokeWidth)
      // .selectAll("circle")
      // .data(I)
      // .join("circle")
      //   .attr("cx", i => xScale(X[i]))
      //   .attr("cy", i => yScale(Y[i]))
      //   .attr("r", r)
  
    return svg.node();
  }

function graph_data(data){
    names = Object.keys(data['CONVENCIONAL CONSTITUYENTE'])
    persons = names.map(
        x => { 
            return {
                name: x,
                "data": data['CONVENCIONAL CONSTITUYENTE'][x]
            } 
        }
    )
    .filter(x => x.data.votos > 10)
    console.log(persons)
    chart = Scatterplot(persons, {
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