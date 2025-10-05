// d3_script.js

// Hàm chính: Load CSV và tạo bar chart (chỉ khi page là 'televisions')
function applyD3Styles(currentPage) {
  if (currentPage !== 'televisions') {
    return;  // Không làm gì ở page khác
  }

  // Clear chart cũ nếu có (tránh chồng chéo khi click lại)
  d3.select("#chart-container").selectAll("*").remove();

  // Step 1 & 2: Load và process CSV
  d3.csv("./data/d3.1.csv", d => {
    return {
      brand: d.Screen_Tech,
      count: +d["Count(Availability Status)"] // converts to number
    };
  }).then(data => {
    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.count));
    console.log(d3.min(data, d => d.count));
    console.log(d3.extent(data, d => d.count));
    createBarChart(data);  // Gọi hàm trong .then
  });
}

// Modular visualisation: Const arrow function nhận data
const createBarChart = (data) => {
  // Xóa SVG cũ nếu có
  d3.select("#chart-container").selectAll("svg").remove();

  // Kích thước SVG
  const svgWidth = 600;
  const svgHeight = 500;

  // Step 1: Tạo scale
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]) // domain = dữ liệu thực
    .range([0, 500-200]); // range = chiều rộng vùng vẽ (fit SVG)

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, svgHeight])
    .padding(0.1);

  // Tạo SVG
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // 🔹 Step 2: Tạo group g để chứa rect + label
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // 🔹 Step 3a: Thêm rectangles (bạn có thể comment code cũ nếu muốn)
  barAndLabel
    .append("rect")
    .attr("x", 100) // đẩy sang phải để chừa chỗ cho text brand
    .attr("y", 0)
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  // 🔹 Step 3b: Thêm text hiển thị tên brand
  barAndLabel
    .append("text")
    .text(d => d.brand)
    .attr("x", 95) // gần bên trái bar
    .attr("y", yScale.bandwidth() / 1.5)
    .attr("text-anchor", "end") // căn phải text
    .style("font-family", "sans-serif")
    .style("font-size", "13px")
    .style("fill", "#333");

  // 🔹 Step 3c: Thêm text hiển thị count (giá trị số)
  barAndLabel
    .append("text")
    .text(d => d.count)
    .attr("x", d => 100 + xScale(d.count) + 4) // sau bar 1 chút
    .attr("y", yScale.bandwidth() / 1.5)
    .style("font-family", "sans-serif")
    .style("font-size", "13px")
    .style("fill", "#333");
};
