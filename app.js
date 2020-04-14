// setting up the chart
var widthSVG = 960;
var heightSVG = 500;

var margins = {
  top: 20 ,
  right: 40,
  bottom: 60,
  left: 100
};

var width = widthSVG - margins.left - margins.right;
var height = heightSVG - margins.top - margins.bottom;

// creating an SVG wrapper, append an SVG group that will hold our chart
var svgWrapper = d3.select(".chart")
  .append("svg")
  .attr("width", widthSVG)
  .attr("height", heightSVG)

var svgChartGroup = svgWrapper.append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`);

// Importing Data
d3.csv("./data/data.csv", function (err, unemploymentData) {
  if (err) throw err;

  // Parsing Data as numbers
   unemploymentData.forEach(function (data) {
    data.UnemploymentRate = +data.UnemploymentRate;
    data.ConfidenceLimitHigh = parseInt(data.ConfidenceLimitHigh);
  });

  // Creating scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([2, d3.max(unemploymentData, d => d.UnemploymentRate)])
    .range([2, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(unemploymentData, d => d.ConfidenceLimitHigh)])
    .range([height, 20]);

  // Creating axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Appending Axes to the chart
  svgChartGroup.append("g")
    .attr("transform", `translate(6, ${height})`)
    .call(bottomAxis);

  svgChartGroup.append("g")
    .call(leftAxis);

   // Creating Circles
  var svgCirclesGroup = svgChartGroup.selectAll("circle")
  .data(unemploymentData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.UnemploymentRate))
  .attr("cy", d => yLinearScale(d.ConfidenceLimitHigh))
  .attr("r", "15")
  .attr("fill", "blue")
  .attr("opacity", ".5")

  // Adding text on the cicles
  var textGroup = svgChartGroup.selectAll("#circleText")
  .data(unemploymentData)
  .enter()
  .append("text")
  .text(d => d.stateAbbr)
  .attr("id", "circleText")
  .attr("x", d => xLinearScale(d.UnemploymentRate)-5)
  .attr("y", d => yLinearScale(d.ConfidenceLimitHigh)+4)
  .attr("stroke-width", "1")
  .attr("fill", "white")
  .attr("font-size", 8);
  

  // Initializing tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([90, -60])
    .html(d =>
      `${d.state}<br>Unemployment Rate: ${d.UnemploymentRate}<br>Confidence Limit: ${d.ConfidenceLimitHigh}`
    );

  // Creating tooltip in the chart
  svgChartGroup.call(toolTip);

  // Creating event listeners to display and hide the tooltip
  svgCirclesGroup.on("mouseover", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Creating axes labels
  svgChartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margins.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Confidence Limit High");

  svgChartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margins.top + 30})`)
    .attr("class", "axisText")
    .text("Unemployment Rate for women under 25-44 years of age");
});


