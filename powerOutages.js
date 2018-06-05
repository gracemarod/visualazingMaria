		//Set the dimensions for the canvas
	//Add the svg canvas
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 80},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//parse the date/time
	var parseDate = d3.timeParse("%x");

	//Set the ranges
	var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height,0]),
		//Z is to add ranges of colors to the line
		z = d3.scaleOrdinal(d3.schemeCategory10);

	//Define the line
	var line = d3.line()
		.x(function(d) {return x(d.date);})
		.y(function(d) {return y(d.outages);})
		//Define is used to omit the null/zero values from appearing in the graph
		.defined(function(d){return d.outages});


    
    //Get the data, call type function to properly format and convert the values
d3.csv("electricOutages_v4.csv",type,function(error,data){
	if(error) throw error
		//we have to mapped the values of the columns to one variable
		var cities = data.columns.slice(1).map(function(id)
			{
				//identify the objects, and use another map function to mapped teh right value to the city
				return {
					id:id,
					values: data.map(function(d){
						return {date:d.date, outages:d[id]}
					})
				};
			});

	
//Scale the range of the data
	x.domain(d3.extent(data,function(d){
		return d.date;}));

	y.domain([
		//find the min value of the power outages and maxium power outages for the domain of y
			d3.min(cities, function(c){return d3.min(c.values,function(d){return d.outages;});}),
			d3.max(cities, function(c){return d3.max(c.values, function(d){return d.outages;});})
		]);
	//return different colors to each different column (city)
	z.domain(cities.map(function(c){return c.id;}));

//Add the X Axis
	g.append("g")
		.attr("class","axis axis--x")
		.attr("transform","translate(0,"+height+")")
		.call(d3.axisBottom(x));

//Add the Y axis
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("transform","rotate(-90)")
		.attr("y",10)
		.attr("fill","#000")
		.text("Power Outages");
	console.log("Wepa");
	var city = g.selectAll(".city")
				.data(cities)
				.enter().append("g")
				.attr("class","city");

	city.append("path")
		.attr("class","line")
		.attr("d", function(d){return line(d.values);})
		.style("stroke",function(d){return z(d.id);});
//add label to the x axis
	city.append("text")
		.datum(function(d,i) { 
			// console.log("ID ",d.id, "I ", i)
			return {id: d.id, value: d.values, inx:i}; })
		// .attr("transform", function(d) { 
				// for(var j = 0; j < d.id.length; j++){
				// 	console.log("Test: ", d.id, j);
				// 	console.log("cities: ",cities)
				// } 
			// console.log("ID: ",d.id, "outages: ",d.values)
			// console.log("Inx2: ", d.inx)
			// return "translate(" + x(d.value.date) + "," + y(d.value.outages) + ")"; })
		.attr("x",width - margin.right)
		.attr("y",function(d){return 12.5 * d.inx})
		 		// for(var j = 0; j < d.id.length; j++){
					// console.log("Test: ", d.id, j);
					// console.log("cities: ",cities)
					// console.log("Index: ", cities.indexOf(d.id))
					// return 12.5 * j;
				// } 
			
		.style("font", "10px sans-serif")
		.style("fill", function(d) { // Add the colours dynamically
                return d.color = z(d.id); })
		.text(function(d){return d.id;});
});

//External function to convert values to integers, parese the date properly and "null" string to 0
function type(d, _, columns){
	d.date = parseDate(d.date);
	for (var i = 1, n = columns.length, c; i < n; ++i) {
			if (d[c = columns[i]] == "null"){
				d[c = columns[i]] = 0;
			}
			d[c = columns[i]] = +d[c]};
  return d;}