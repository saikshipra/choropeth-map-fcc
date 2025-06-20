const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

const width = 1000;
const height = 600;

Promise.all([
  d3.json("counties.json"),
  d3.json("for_user_education.json")
]).then(([countyData, educationData]) => {
  const eduMap = new Map(educationData.map(d => [d.fips, d]));

  const path = d3.geoPath();

  const colorScale = d3.scaleQuantize()
    .domain(d3.extent(educationData, d => d.bachelorsOrHigher))
    .range(d3.schemeBlues[9]);

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter().append("path")
    .attr("class", "county")
    .attr("d", path)
    .attr("data-fips", d => d.id)
    .attr("data-education", d => eduMap.get(d.id)?.bachelorsOrHigher || 0)
    .attr("fill", d => colorScale(eduMap.get(d.id)?.bachelorsOrHigher || 0))
    .on("mouseover", function(event, d) {
      const edu = eduMap.get(d.id);
      tooltip
        .style("visibility", "visible")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + "px")
        .attr("data-education", edu?.bachelorsOrHigher || 0)
        .html(`${edu?.area_name}, ${edu?.state}<br>${edu?.bachelorsOrHigher}%`);
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));

  // Add legend later
});
