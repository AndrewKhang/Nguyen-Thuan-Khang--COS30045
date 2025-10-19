
// Main function: Load CSV and create bar chart (only when page is 'televisions')
function applyD3Style(currentPage) {


  // Clear any existing chart (avoid overlapping when clicked again)
  d3.select("#chart-container").selectAll("*").remove();

  // Step 1 & 2: Load and process CSV data
  d3.csv("./data/d3.1.csv", d => {
    return {
      brand: d.Screen_Tech,
      count: +d["Count(Availability Status)"] // convert to number
    };
  }).then(data => {
    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.count));
    console.log(d3.min(data, d => d.count));
    console.log(d3.extent(data, d => d.count));
    createBarChart(data);  // Call chart function after data is loaded
  });
}

// Modular visualization: Const arrow function receives data
const createBarChart = (data) => {
  // Remove any old SVG if present
  d3.select("#chart-container").selectAll("svg").remove();

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 500;

  // Step 1: Create scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]) // domain = actual data values
    .range([0, 500 - 200]); // range = display width (fit inside SVG)

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, svgHeight])
    .padding(0.1);

  // Create SVG element
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // 🔹 Step 2: Create <g> groups to hold each rect + label together
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // 🔹 Step 3a: Add rectangles (you can comment out the old code if needed)
  barAndLabel
    .append("rect")
    .attr("x", 100) // push bars right to make room for labels
    .attr("y", 0)
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  // 🔹 Step 3b: Add text for brand labels
  barAndLabel
    .append("text")
    .text(d => d.brand)
    .attr("x", 95) // slightly left of the bar
    .attr("y", yScale.bandwidth() / 1.5)
    .attr("text-anchor", "end") // right-align the text
    .style("font-family", "sans-serif")
    .style("font-size", "13px")
    .style("fill", "#333");

  // 🔹 Step 3c: Add text for count values
  barAndLabel
    .append("text")
    .text(d => d.count)
    .attr("x", d => 100 + xScale(d.count) + 4) // place slightly after the bar
    .attr("y", yScale.bandwidth() / 1.5)
    .style("font-family", "sans-serif")
    .style("font-size", "13px")
    .style("fill", "#333");
};
