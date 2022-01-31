//import { mouseLeave } from './events';  // named import

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

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", marginLeft)
      .attr("y", -marginBottom);
    
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
        .html(`${data[i]['name']} - ${data[i]['data']['partido']}`)

      selected_partido = partidos.get(data[i]['data']['partido'])

      d3.selectAll(".dot")
        .transition()
        .duration(100)
        .style("fill", "lightgrey")

      d3.selectAll("." + selected_partido)
        .transition()
        .duration(100)
        .style("fill", colorScale(selected_partido))

    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(event, i) {
      d3.select(this).transition()
        .duration('100')
        .attr("r", r*2)
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }



    const partidos = new Map()

    data.forEach(person => {
      if(!partidos.has(person.data.partido)){
        partidos.set(person.data.partido, 'partido-' + partidos.size)
      }      
    });

    const colorScale = d3.scaleOrdinal()
        .range(d3.schemeSet1)
        .domain(partidos)

    console.log(partidos)
     
    //  // Highlight the specie that is hovered
    // var highlight = function(event, d){

    //   selected_partido = data[d]['data']['partido'].replace(/ /g, '')

    //   d3.selectAll(".dot")
    //     .transition()
    //     .duration(200)
    //     .style("fill", "lightgrey")

    //   d3.selectAll("." + selected_partido)
    //     .transition()
    //     .duration(200)
    //     .style("fill", colorScale(selected_partido))
    // }

    // // Highlight the specie that is hovered
    // var doNotHighlight = function(){
    //   d3.selectAll(".dot")
    //     .transition()
    //     .duration(200)
    //     .style("fill", "lightgrey")
    //     .attr("r", 5 )
    // }




    // Create the scatter variable: where both the circles and the brush take place
    var scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")

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
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
      .on("click", person)


    // Zoom
    var zoom = d3.zoom()
        .scaleExtent([0.5, 15])
        
        .on('zoom', function(event, i) {
            // update circles
            svg.selectAll('circle')
            .attr('transform', event.transform)

            // recover the new scale
            var newX = event.transform.rescaleX(xScale)
            var newY = event.transform.rescaleY(yScale)

            // update axes with these new boundaries
            xAxiss.call(d3.axisBottom(newX))
            yAxiss.call(d3.axisLeft(newY))            
    });

    svg.call(zoom);

    function person(event, i){
      var container = document.getElementById('person')
      var summary = document.getElementById('summary')

      const person = data[i]
      summary.innerHTML = `
        <h3>${person['name']}</h3>
        <h4>${person['data']['partido']} - ${person['data']['region']}</h4>
        <p>
          <b>Ingreso Total</b> : ${person['data']['ingreso_total']} <br />
          <b>Votos</b> : ${person['data']['votos']}
        </p>`

      var incomes = document.getElementById('incomes')
      const aportantes = person['data']['ficha']
      var table = `
        <table border=1 width=40%>
          <tr>
            <th>Aportante</th>
            <th>Rut aportante</th>
            <th>Monto</th>
          </tr>
      `
      aportantes.forEach((aportante) => {
        table += `
          <tr>
            <td>${aportante['aportante']}</td>
            <td>${aportante['rut_aportante']}</td>
            <td>${aportante['monto']}</td>
          </tr>
          `
      })

      table += `
      </table>
      `
      incomes.innerHTML = table

      console.log(aportantes)
      container.appendChild(summary)
      container.appendChild(incomes)
    }
  
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