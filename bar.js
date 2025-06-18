document.addEventListener("DOMContentLoaded", () => {
  d3.csv("Bar_race.csv", d3.autoType).then(data => {
    if (!data || data.length === 0) {
      console.error("No data found in Bar_race.csv");
      return;
    }

    // Assume your data has a structure like [{name: "A", value: 10}, ...]
    // You might need to adjust keys based on your CSV columns

    const width = 600;
    const barHeight = 30;

    // Create SVG container
    const svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", barHeight * data.length);

    // Define scale based on data values
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Oil)])
      .range([0, width - 100]);

    // Create bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d, i) => i * barHeight)
      .attr("width", d => x(d.Oil))
      .attr("height", barHeight - 5)
      .attr("fill", "steelblue");

    // Add text labels
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => x(d.Oil) + 5)
      .attr("y", (d, i) => i * barHeight + barHeight / 2)
      .attr("dy", ".35em")
      .text(d => d.Country + ": " + d.Oil);
  });
});
