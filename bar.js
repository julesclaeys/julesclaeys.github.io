document.addEventListener("DOMContentLoaded", () => {
  d3.csv("Bar_race.csv", d3.autoType).then(data => {
    // Check if data loaded
    if (!data || data.length === 0) {
      console.error("No data found in Bar_race.csv");
      return;
    }

    // Create a table
    const table = d3.select("body").append("table").style("border-collapse", "collapse");

    // Append header row
    const header = table.append("thead").append("tr");
    header.selectAll("th")
      .data(d3.keys(data[0]))
      .enter()
      .append("th")
      .text(d => d)
      .style("padding", "8px")
      .style("border", "1px solid black");

    // Append data rows
    const rows = table.append("tbody")
      .selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

    rows.selectAll("td")
      .data(d => d3.values(d))
      .enter()
      .append("td")
      .text(d => d)
      .style("padding", "8px")
      .style("border", "1px solid black");
  });
});
