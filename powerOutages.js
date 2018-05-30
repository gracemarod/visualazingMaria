//Set the dimensions for the canvas
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 950 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
	
var parseTime = d3.timeParse("%x");
	//Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);


	//Define the line
	var valueline = d3.line()
		.x(function(d) {return x(d.date);})
		.y(function(d) {return y(d.outages);});

//Add the svg canvas
var svg = d3.select("body")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform","translate(" +margin.left +","+margin.top+")");
//Get the data
d3.csv("../static/test_data_Texas.csv",function(error,data){
	if(error) throw error;
	
	//format the data
	data.forEach(function(d){
		d.date = parseTime(d.Date);
		// console.log(d.date)
		if  (d.Harvey_Texas_customers != "")
			d.outages = +d.Harvey_Texas_customers;
		console.log(d.outages)
	});
	
//Scale the range of the data
	x.domain(d3.extent(data,function(d){
		return d.date;}));
	y.domain([0,d3.max(data,function(d){
		return d.outages;})]);

//add the valueline path
	svg.append("path")
		.data([data])
		.filter(function(d){return d.outages != "" || d.outages > 0 })
		.attr("class", "line")
		.attr("d",valueline);

//Add the X Axis
	svg.append("g")
		.attr("transform","translate(0,"+height+")")
		.call(d3.axisBottom(x));
//Add the Y axis
	svg.append("g")
		.call(d3.axisLeft(y));
});