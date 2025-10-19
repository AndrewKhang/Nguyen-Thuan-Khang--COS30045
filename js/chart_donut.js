// chart_donut.js
// Donut chart: average labelled energy consumption by Screen_Tech (all sizes)
// Expects <div id="donutChart"></div> in HTML and D3 v7 loaded.

function applyD3Styles1(currentPage){
    const csvPath = "./data/Ex5_TV_energy_Allsizes_byScreenType.csv";
    const containerId = "donutChart";
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 20;
  
    d3.csv(csvPath, d => ({
      screen_tech: d.Screen_Tech,
      meanEnergy: d["Mean(Labelled energy consumption (kWh/year))"] === "" ? 0 : +d["Mean(Labelled energy consumption (kWh/year))"]
    })).then(data => {
      const svg = d3.select("#" + containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);
  
      const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(data.map(d => d.screen_tech));
  
      const pie = d3.pie()
        .value(d => d.meanEnergy)
        .sort(null);
  
      const arc = d3.arc()
        .innerRadius(radius * 0.55) // donut hole
        .outerRadius(radius);
  
      const arcs = svg.selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.screen_tech))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.2);
  
      // Labels (outside)
      const labelArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);
      svg.selectAll("text")
        .data(pie(data))
        .join("text")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .text(d => d.data.screen_tech);
  
      // Legend (simple)
      const legend = svg.append("g")
        .attr("transform", `translate(${-(width/2)+10},${-(height/2)+10})`);
  
      data.forEach((d, i) => {
        const g = legend.append("g").attr("transform", `translate(0, ${i*18})`);
        g.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(d.screen_tech));
        g.append("text").attr("x", 16).attr("y", 10).style("font-size", "11px").text(`${d.screen_tech} (${d.meanEnergy})`);
      });
  
      // Title
      svg.append("text")
        .attr("x", 0)
        .attr("y", -radius - 10)
        .attr("text-anchor", "middle")
        .style("font-weight", "600")
        .text("Donut: Mean energy by Screen Tech (All sizes)");
    });
  };
  