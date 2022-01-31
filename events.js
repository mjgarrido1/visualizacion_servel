
// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it.
export function mouseOverFunction(event, i, partidos, data, tooltip, svg, colorScale, r){
  tooltip
    .style("opacity", 1)
    .style("left", (d3.pointer(event, svg)[0])+5 + "px") 
    .style("top", (d3.pointer(event, svg)[1])-25 + "px")
    .html(`${data[i]['name']} - ${data[i]['data']['partido']}`)

  var selected_partido = partidos.get(data[i]['data']['partido'])

  d3.selectAll(".dot")
    .transition()
    .duration(100)
    .style("fill", "lightgrey")

  d3.selectAll("." + selected_partido)
    .transition()
    .duration(100)
    .style("fill", colorScale(selected_partido))
    .attr('r', r*3)
}

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
export function mouseLeaveFunction(event, i, partidos, data, tooltip, r) {
  var selected_partido = partidos.get(data[i]['data']['partido'])
  d3.selectAll("." + selected_partido)
    .transition()
    .duration('100')
    .attr("r", r*2)
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
  }

export function zoomFunction(event, i, svg, xScale, yScale, xAxiss, yAxiss){
  // update circles
  svg.selectAll('circle')
  .attr('transform', event.transform)

  // recover the new scale
  var newX = event.transform.rescaleX(xScale)
  var newY = event.transform.rescaleY(yScale)

  // update axes with these new boundaries
  xAxiss.call(d3.axisBottom(newX))
  yAxiss.call(d3.axisLeft(newY)) 
}