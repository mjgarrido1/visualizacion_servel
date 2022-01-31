

export function mouseLeave(event, i) {
    d3.select(this).transition()
      .duration('100')
      .attr("r", r*2)
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }