		//Set the dimensions for the canvas
	//Add the svg canvas
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//parse the date/time
	var parseDate = d3.timeParse("%x");

	//Set the ranges
	var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height,0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

	//Define the line
	var line = d3.line()
		.x(function(d) {return x(d.date);})
		.y(function(d) {return y(d.outages);})
		.defined(function(d){return d.outages});


    //Get the data

d3.csv("test_data_Texas.csv",type,function(error,data){
	if(error) throw error


		// d.date = parseDate(d.Date);

		// if (d.Harvey_Texas === "null") {
		// 	d.Harvey_Texas = null;
		// }

		var cities = data.columns.slice(1).map(function(id)
			{
				return {
					id:id,
					values: data.map(function(d){
						return {date:d.date, outages:d[id]}
					})
				};
			});
		//d.outages = +d.Harvey_Texas;

		// console.log("Outages: ",d.outages);

	
//Scale the range of the data
	x.domain(d3.extent(data,function(d){
		return d.date;}));

	y.domain([
			d3.min(cities, function(c){return d3.min(c.values,function(d){return d.outages;});}),
			d3.max(cities, function(c){return d3.max(c.values, function(d){return d.outages;});})
		]);
	z.domain(cities.map(function(c){return c.id;}));

//add the valueline path

	// svg.append("path")
	// 	.data([data])
	// 	.attr("class", "line")

	// 	.attr("d",valueline(data));

//Add the X Axis
	g.append("g")
		.attr("class","axis axis--x")
		.attr("transform","translate(0,"+height+")")
		.call(d3.axisBottom(x));
//Add the Y axis
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y));

	var city = g.selectAll(".city")
				.data(cities)
				.enter().append("g")
				.attr("class","city");

	city.append("path")
		.attr("class","line")
		.attr("d", function(d){return line(d.values);})
		.style("stroke",function(d){return z(d.id);});
});

function type(d, _, columns){
	d.date = parseDate(d.date);
	for (var i = 1, n = columns.length, c; i < n; ++i) {
			if (d[c = columns[i]] == "null"){
				d[c = columns[i]] = 0;
			}
			d[c = columns[i]] = +d[c]};
  return d;}