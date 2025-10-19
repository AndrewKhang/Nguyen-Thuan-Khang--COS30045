// chart_line.js
// Line chart: Average Price (notTas-Snowy) over Year (1998-2024)


function applyD3Styles3(currentPage) {
    const csvPath = "./data/Ex5_ARE_Spot_Prices.csv";
    const containerId = "lineChart";
    const width = 800;
    const height = 420;
    const margin = { top: 50, right: 40, bottom: 60, left: 80 };
  
    d3.csv(csvPath, d => ({
      year: d.Year === "" ? NaN : +d.Year,
      avgPrice: d["Average Price (notTas-Snowy)"] === "" ? NaN : +d["Average Price (notTas-Snowy)"]
    })).then(data => {
      const filtered = data.filter(d => !isNaN(d.year) && !isNaN(d.avgPrice));
      filtered.sort((a,b) => a.year - b.year);
  
      const svg = d3.select("#" + containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;
      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  
      const x = d3.scaleLinear()
        .domain(d3.extent(filtered, d => d.year))
        .range([0, innerW]);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(filtered, d => d.avgPrice)]).nice()
        .range([innerH, 0]);
  
      // Axes
      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d"))); // integers for years
  
      g.append("g").call(d3.axisLeft(y));
  
      // Line generator
      const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.avgPrice))
        .curve(d3.curveMonotoneX);
  
      g.append("path")
        .datum(filtered)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
  
      // Dots
      g.selectAll("circle")
        .data(filtered)
        .join("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.avgPrice))
        .attr("r", 3)
        .attr("fill", "steelblue");
  
      // Title and labels
      svg.append("text")
        .attr("x", width/2)
        .attr("y", 22)
        .attr("text-anchor", "middle")
        .style("font-weight", "600")
        .text("Line: Average Spot Price (notTas-Snowy) by Year");
  
      svg.append("text")
        .attr("x", margin.left + innerW/2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Year");
  
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - (margin.top + innerH/2))
        .attr("y", 18)
        .attr("text-anchor", "middle")
        .text("Average Price ($ per megawatt hour)");
    });
  };
  