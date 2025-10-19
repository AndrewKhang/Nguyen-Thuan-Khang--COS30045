// Bar chart: mean energy consumption by Screen_Tech for 55-inch TVs

function applyD3Styles2(currentPage) {
    const csvPath = "./data/Ex5_TV_energy_55inchtv_byScreenType.csv";
    const containerId = "barChart";
    const width = 700;
    const height = 420;
    const margin = { top: 50, right: 20, bottom: 100, left: 90 };
  
    d3.csv(csvPath, d => ({
      screen_tech: d.Screen_Tech,
      meanEnergy: d["Mean(Labelled energy consumption (kWh/year))"] === "" ? 0 : +d["Mean(Labelled energy consumption (kWh/year))"]
    })).then(data => {
      // sort by value descending for nicer display
      data.sort((a,b) => b.meanEnergy - a.meanEnergy);
  
      const svg = d3.select("#" + containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;
      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  
      const x = d3.scaleBand()
        .domain(data.map(d => d.screen_tech))
        .range([0, innerW])
        .padding(0.2);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.meanEnergy)]).nice()
        .range([innerH, 0]);
  
      // Bars
      g.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.screen_tech))
        .attr("y", d => y(d.meanEnergy))
        .attr("width", d => x.bandwidth())
        .attr("height", d => innerH - y(d.meanEnergy))
        .attr("fill", "steelblue");
  
      // X axis rotated labels
      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end");
  
      // Y axis
      g.append("g").call(d3.axisLeft(y));
  
      // Bar value labels
      g.selectAll(".value")
        .data(data)
        .join("text")
        .attr("x", d => x(d.screen_tech) + x.bandwidth()/2)
        .attr("y", d => y(d.meanEnergy) - 6)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .text(d => d.meanEnergy);
  
      // Title
      svg.append("text")
        .attr("x", width/2)
        .attr("y", 22)
        .attr("text-anchor", "middle")
        .style("font-weight", "600")
        .text("Bar: Mean energy by Screen Tech (55-inch TVs)");
    });
  };
  