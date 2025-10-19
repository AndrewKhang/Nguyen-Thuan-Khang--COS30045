// chart_scatter.js
// Scatter plot: energy_consumpt vs star2 (rating)


function applyD3Styles(currentPage) {
  const csvPath = "./data/Ex5_TV_energy.csv";
  const containerId = "scatterChart";
  const width = 700;
  const height = 450;
  const margin = { top: 40, right: 20, bottom: 60, left: 80 };

  d3.csv(csvPath, d => ({
    brand: d.brand,
    screen_tech: d.screen_tech,
    screensize: d.screensize,
    energy: d.energy_consumpt === "" ? NaN : +d.energy_consumpt,
    star: d.star2 === "" ? NaN : +d.star2,
    count: d.count === "" ? NaN : +d.count
  })).then(data => {
    // Filter out invalid rows
    const filtered = data.filter(d => !isNaN(d.energy) && !isNaN(d.star));

    const svg = d3.select("#" + containerId)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(filtered, d => d.star)).nice()
      .range([0, innerW]);

    const y = d3.scaleLinear()
      .domain(d3.extent(filtered, d => d.energy)).nice()
      .range([innerH, 0]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(6));

    g.append("g")
      .call(d3.axisLeft(y));

    // Axis labels
    svg.append("text")
      .attr("x", margin.left + innerW / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Star rating (star2)");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - (margin.top + innerH / 2))
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .text("Energy consumption (kWh/year)");

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("padding", "6px 8px")
      .style("background", "rgba(0,0,0,0.7)")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("display", "none");

    // Points
    g.selectAll("circle")
      .data(filtered)
      .join("circle")
      .attr("cx", d => x(d.star))
      .attr("cy", d => y(d.energy))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .attr("opacity", 0.8)
      .on("mousemove", (event, d) => {
        tooltip
          .style("display", "block")
          .html(`<strong>${d.brand}</strong><br/>Screen: ${d.screen_tech}<br/>Size: ${d.screensize}<br/>Star: ${d.star}<br/>Energy: ${d.energy}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseleave", () => tooltip.style("display", "none"));

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .style("font-weight", "600")
      .text("Scatter: Energy consumption vs Star rating");
  });
};
