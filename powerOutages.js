		//Set the dimensions for the canvas
var margin = {top: 30, right:20, bottom:30,left:50},
	width = 600 - margin.left - margin.right,
	height = 270 - margin.top -margin.right;
	
	//parse the date/time
	var parseDate = d3.timeParse("%x");

	//Set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height,0]);


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
d3.csv("test_data_Texas.csv",function(error,data){
	if(error) throw error

	data.forEach(function(d){
		if (d.Harvey_Texas_customers == "null") d.Harvey_Texas_customers = null;
	});	

	data.forEach(function(d){
		d.date = parseDate(d.Date);

		d.outages = +d.Harvey_Texas_customers;
	});


//Scale the range of the data
	x.domain(d3.extent(data,function(d){
		return d.date;}));
	y.domain([0,d3.max(data,function(d){
		return d.outages;})]);
//add the valueline path
	svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d",valueline(data));

//Add the X Axis
	svg.append("g")
		.attr("class","x axis")
		.attr("transform","translate(0,"+height+")")
		.call(d3.axisBottom(x));
//Add the Y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(y));
});