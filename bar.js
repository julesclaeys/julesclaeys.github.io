document.addEventListener("DOMContentLoaded", async () => {
  const rawData = await d3.csv("Bar_race.csv", d3.autoType);

  const width = 800;
  const height = 500;
  const margin = { top: 30, right: 30, bottom: 30, left: 100 };
  const barHeight = 30;
  const duration = 100 ;

  // Group data by year
  const years = Array.from(d3.group(rawData, d => d.Year), ([year, values]) => ({
    year: +year,
    data: values.sort((a, b) => d3.descending(a.Oil, b.Oil)).slice(0, 10)
  }));

  // Create SVG
  const svg = d3.select("body").append("svg")
    .attr("width", "100%")
    .attr("height", height);

  const x = d3.scaleLinear().range([margin.left, width - margin.right]);
  const y = d3.scaleBand()
    .range([margin.top, margin.top + barHeight * 10])
    .padding(0.1);

  const barGroup = svg.append("g");

  const yearLabel = svg.append("text")
    .attr("x", width - margin.right)
    .attr("y", height - margin.bottom)
    .attr("text-anchor", "end")
    .attr("font-size", "24px")
    .attr("fill", "#333");

  for (const frame of years) {
    const data = frame.data;
    x.domain([0, d3.max(data, d => d.Oil)]);
    y.domain(data.map(d => d.Country));

    const t = svg.transition().duration(duration);

    const bars = barGroup.selectAll("rect")
      .data(data, d => d.Country);

    bars.enter().append("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.Country))
      .attr("width", d => x(d.Oil) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue")
      .merge(bars)
      .transition(t)
      .attr("y", d => y(d.Country))
      .attr("width", d => x(d.Oil) - margin.left);

    bars.exit().transition(t)
      .attr("width", 0)
      .remove();

    const labels = barGroup.selectAll("text")
      .data(data, d => d.Country);

    labels.enter().append("text")
      .attr("x", d => x(d.Oil) + 5)
      .attr("y", d => y(d.Country) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .text(d => d.Country)
      .merge(labels)
      .transition(t)
      .attr("x", d => x(d.Oil) + 5)
      .attr("y", d => y(d.Country) + y.bandwidth() / 2);

    labels.exit().transition(t).remove();

    yearLabel.text(frame.year);

    await t.end(); // Wait for transition to finish
  }
});
