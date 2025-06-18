document.addEventListener("DOMContentLoaded", async () => {
  const rawData = await d3.csv("Bar_race.csv", d3.autoType);

  const width = 1000;
  const height = 850;
  const margin = { top: 30, right: 250, bottom: 60, left: 100 };
  const barHeight = (height - margin.top - margin.bottom) / 10;
  const duration = 700;

  // Group data by year and sort top 10
const years = Array.from(d3.group(rawData.filter(d => d.Year >= 1900), d => d.Year), ([year, values]) => ({
  year: +year,
  data: values.sort((a, b) => d3.descending(a.Oil, b.Oil)).slice(0, 10)
})).sort((a, b) => a.year - b.year);


  const allCountries = Array.from(new Set(rawData.map(d => d.Country)));


const continentColors = {
  "Asia": "#e099cc",
  "Europe": "#8fa3e1",
  "Africa": "#f0e2c3",
  "North America": "#7469B6",
  "South America": "#d2d8ec",
};


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

  const xAxisGroup = svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${margin.top + barHeight * 10 + 5})`);

x.domain([0, d3.max(years[0].data, d => d.Oil)]);
  xAxisGroup.call(d3.axisBottom(x).ticks(width / 100).tickFormat(d3.format(",.0f")));
   svg.append("text")
  .attr("class", "x-axis-label")
  .attr("x", width / 2)
  .attr("y", margin.top + barHeight * 10 + 35)
  .attr("text-anchor", "middle")
  .attr("fill", "#333")
  .text("Oil Production (TWh)");

const legendGroup = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

const legendItemSize = 20;
const legendSpacing = 5;
const legendItemHeight = 25;  // vertical spacing per legend item

const continents = Array.from(new Set(rawData.map(d => d.Continent)));

legendGroup.selectAll("rect")
  .data(continents)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * legendItemHeight)
  .attr("width", legendItemSize)
  .attr("height", legendItemSize)
  .attr("fill", d => continentColors[d] || "#ccc");

legendGroup.selectAll("text")
  .data(continents)
  .enter()
  .append("text")
  .attr("x", legendItemSize + legendSpacing)
  .attr("y", (d, i) => i * legendItemHeight + legendItemSize / 2)
  .attr("dy", "0.35em")
  .attr("fill", "#333")
  .text(d => d);

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
      .attr("fill", d => continentColors[d.Continent] || "#ccc")
      .attr("opacity", 0.8)
      ;

    // UPDATE + ENTER merged
    barsEnter.merge(bars)
      .transition(t)
      .attr("y", d => y(d.Country))
      .attr("width", d => x(d.Oil) - x(0))
      .attr("opacity", 0.8);
    // LABELS
    const labels = barGroup.selectAll(".label").data(data, d => d.Country);

    labels.exit()
      .transition(t)
      .duration(duration/2)
      .attr("x", x(0))
      .attr("fill-opacity", 0)
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

const valueLabels = barGroup.selectAll(".value-label")
  .data(data, d => d.Country);

// ENTER
const valueLabelsEnter = valueLabels.enter().append("text")
  .attr("class", "value-label")
  .attr("fill", "white")
  .attr("font-weight", "bold")
  .attr("font-size", 12)
  .attr("text-anchor", "end")
  .attr("dy", "0.35em");

// UPDATE + ENTER
valueLabelsEnter.merge(valueLabels)
  .text(d => `${d3.format(",.0f")(d.Oil)} TWh`) // Rounds and adds commas
  .transition(t)
  .attr("x", d => x(d.Oil) - 5)
  .attr("y", d => y(d.Country) + y.bandwidth() / 2);

// EXIT
valueLabels.exit()
  .transition(t)
  .attr("fill-opacity", 0)
  .remove();


    xAxisGroup.transition(t)
  .call(d3.axisBottom(x).ticks(width / 100).tickFormat(d3.format(",.0f")));


    await t.end();
  }
});
