document.addEventListener("DOMContentLoaded", async () => {
  const rawData = await d3.csv("Bar_race.csv", d3.autoType);

  const width = 800;
  const height = 500;
  const margin = { top: 30, right: 30, bottom: 30, left: 100 };
  const barHeight = 30;
  const duration = 700;

  // Group data by year and sort top 10
  const years = Array.from(d3.group(rawData, d => d.Year), ([year, values]) => ({
    year: +year,
    data: values.sort((a, b) => d3.descending(a.Oil, b.Oil)).slice(0, 10)
  }));

  const allCountries = Array.from(new Set(rawData.map(d => d.Country)));
  const colorScale = d3.scaleOrdinal()
    .domain(allCountries)
    .range(d3.schemeCategory10);

  const svg = d3.select("#chart").append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", "100%")
    .attr("height", height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("background", "white");

  const x = d3.scaleLinear().range([margin.left, width - margin.right]);
  const y = d3.scaleBand()
    .range([margin.top, margin.top + barHeight * 10])
    .padding(0.1);

  const barGroup = svg.append("g");

  const yearLabel = svg.append("text")
    .attr("x", width - margin.right)
    .attr("y", height - margin.bottom)
    .attr("text-anchor", "end")
    .attr("font-size", "32px")
    .attr("fill", "#333")
    .attr("font-weight", "bold");

  for (const frame of years) {
    const data = frame.data;

    x.domain([0, d3.max(data, d => d.Oil)]);
    y.domain(data.map(d => d.Country));

    // Transition setup
    const t = svg.transition().duration(duration);

    // BARS
    const bars = barGroup.selectAll("rect").data(data, d => d.Country);

    // EXIT old bars
    bars.exit()
      .transition(t)
      .attr("width", 0)
      .remove();

    // ENTER new bars
    const barsEnter = bars.enter().append("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.Country))
      .attr("height", y.bandwidth())
      .attr("width", 0) // start width zero for animation
      .attr("fill", d => colorScale(d.Country));

    // UPDATE + ENTER merged
    barsEnter.merge(bars)
      .transition(t)
      .attr("y", d => y(d.Country))
      .attr("width", d => x(d.Oil) - x(0));

    // LABELS
    const labels = barGroup.selectAll("text.label").data(data, d => d.Country);

    labels.exit()
      .transition(t)
      .attr("x", x(0))
      .remove();

    const labelsEnter = labels.enter().append("text")
      .attr("class", "label")
      .attr("x", x(0))
      .attr("y", d => y(d.Country) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .text(d => d.Country);

    labelsEnter.merge(labels)
      .transition(t)
      .attr("x", d => x(d.Oil) + 5)
      .attr("y", d => y(d.Country) + y.bandwidth() / 2);

    // YEAR LABEL
    yearLabel.text(frame.year);

    await t.end();
  }
});
