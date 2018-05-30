
d3.csv("./static/electricOutages_v2.csv",function(error,data){
	data.forEach(function(d){
		d.close = +d.close;
		console.log(d.Date);
	});
});
