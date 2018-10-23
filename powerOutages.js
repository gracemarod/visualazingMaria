		//Set the dimensions for the canvas
	//Add the svg canvas
var svg = d3.select("svg"),
    margin = {top: 50, right: 80, bottom: 60, left: 100},
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
				//identify the objects, and use another map function to mapped the right value to the city
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
			d3.min(cities, function(c){return d3.min(c.values,function(d){
        return d.outages;
      });}),
      //Trying to filter cities with tope 10 (or 8) of amount of values
			d3.max(cities, function(c){
          var count = 0;
          for (var i =0; i < c.values.length;i++){
            if (c.values[i].outages != 0) {
              count+=1;
            }
          }
          console.log(c.id ,count);

        return d3.max(c.values, function(d){return d.outages;});})
		]);
	//return different colors to each different column (city)
	z.domain(cities.map(function(c){return c.id;}));

//Add the X Axis
	g.append("g")
		.attr("class","axis axis--x")
		.attr("transform","translate(0,"+height+")")
		.call(d3.axisBottom(x))
		.append("text")
		.attr("fill","#000")
		.attr("x",width/2)
		.attr("y",40)
		.style("font", "14px sans-serif")
		.text("Date");

//Add the Y axis
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("transform","rotate(-90)")
		.attr("y",-65)
		.attr("x",-(height/2) +40)
		.attr("fill","#000")
		.style("font", "14px sans-serif")
		.text("Power Outages");

	var city = g.selectAll(".city")
				.data(cities)
				.enter().append("g")
				.attr("class","city");

	city.append("path")
		.attr("class","line")
		.style("stroke",function(d){return z(d.id);})
		.attr("id", function(d){return 'tag'+ d.id.replace(/\s+/g, '')} ) // assign an ID
		.attr("d", function(d){return line(d.values);});

//add circles
	// city.selectAll("dot")
	// 	.data(data)
	// 	.enter().append("circle")
	// 	.attr("r",3)
	// 	.attr("cx",function(d){return x(d.date)})
	// 	.attr("cy",function(d,i,j){
	// 		var dKeys = ["Harvey_Texas","Harvey_Louisiana","Irma_PuertoRico","Irma_StCroix","Irma_StJohn","Irma_StThomas","Irma_Florida","Irma_Georgia","Irma_SouthCarolina","Irma_NorthCarolina","Irma_Alabama","Maria_PuertoRico","Maria_StThomas","Maria_StJohn","Maria_StCroix","Nate_Alabama","Nate_Florida","Nate_Mississippi"]

	// 		// for (var i = 1; i < dKeys.length;i++ ){
	// 			console.log("d: ",d)
	// 			console.log("State: ", dKeys[i%17], "D: ",d[dKeys[i%17]] )
	// 			return y(d[dKeys[i%17]])
	// 		// }
	// 		// console.log(d.Harvey_Texas)

	// 		});


//add title
	var title = "Power Outages Comparision in Hurricane Season 2017";
	  g.append("text")
		.attr("x",175)
		.attr("y",-25)
		.style("font", "16px sans-serif")
		.style("fill", "#000" )
		.text(title);
 console.log("Cities: ",city._groups);
for (var i = 0; i <city.length; i++){
  console.log(city[i]);
}

//add rectangles for legend
	city.append("rect")
		.datum(function(d,i) {
			// console.log("ID ",d.id, "I ", i)
			return {id: d.id, inx:i}; })
		.attr("x",width - margin.right - 15)
		.attr("y",function(d){return 15 * d.inx - 9})
		.attr("width", 10)
        .attr("height", 10)
        .attr("id", function(d){return 'legendSquare'+ d.id.replace(/\s+/g, '')} )
        .style("fill", function(d) { // Add the colors dynamically
                return d.color = z(d.id); });

   g.append("text")
	.attr("x",width - margin.right -15)
	.attr("y",-15)
	.attr("class","legend")
	.style("font", "11px sans-serif")
	.style("fill", "black" )
	.text("Hurricane_affected state/island");
//add label to the x axis
	city.append("text")
		.datum(function(d,i) {
			// console.log("ID ",d.id, "I ", i)
			return {id: d.id, inx:i}; })
		.attr("x",width - margin.right)
		.attr("y",function(d){return 15 * d.inx })
		.attr("class","legend")
		.attr("id", function(d){return 'hurricaneState'+ d.id.replace(/\s+/g, '')} ) // assign an ID
    .style("font", "12px sans-serif")
		.style("fill", "#000" )
		.on("click", function(d){
			var active = d.active?false:true,
			newOpacity = active? 0:1;
			newOpacityText = active? 0.5:1;
			//Hide or show the elements based on the ID
			console.log("#tag" + d.id.replace(/\s+/g,''))
			d3.select("#tag" + d.id.replace(/\s+/g,''))
			.transition().duration(100)
			.style("opacity",newOpacity);

			d3.select("#hurricaneState" + d.id.replace(/\s+/g,'') )
			.transition().duration(100)
			.style("opacity",newOpacityText);

			d3.select("#legendSquare" + d.id.replace(/\s+/g,'') )
			.transition().duration(100)
			.style("opacity",newOpacityText);
			//Update whether or not the elements are active
			d.active = active;
		})
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
