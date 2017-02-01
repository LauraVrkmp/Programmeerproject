// Inspired by Mike Bostock: https://bl.ocks.org/mbostock/3035090
// Programming project by Laura Veerkamp

var line_obj = [];
var height_graph, line_data, x, y, xAxis_line, yAxis_line, line;

//set-up line graph
function setLinegraph(world){
	var margin = {top: 50, right: 10, bottom: 40, left: 90},
		width = 800 - margin.left - margin.right;
	height_graph = 300 - margin.top - margin.bottom;
	
	line_data = topojson.feature(world, world.objects.world).features;
	
	//fill data array with yearly data per country
	line_data.map(function(d) {fill_line_array(d)});
	
	x = d3.scale.linear().domain([2007, 2014]).range([20, width-20]);
	y = d3.scale.linear().domain([,]).range([height_graph, 0]);
		
	xAxis_line = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format("d"));
	yAxis_line = d3.svg.axis().scale(y).orient("left");
	
	//define x and y values for line, skip if data has no value
	line = d3.svg.line()
		.defined(function(d, i) {return line_obj[i][1] != null})
		.x(function(d, i) {return x(line_obj[i][0])})
		.y(function(d, i) {return height_graph});
	
	//set-up d3 tip with addition formatting
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.style("margin-top", "-5px")
		.html(function(d, i){
			var addition = "";
			if (topic == "prevalence"){
				addition = "%";
			}
			else if (topic == "purity"){
				if (drug == "cannabis"){
					addition = "% THC"
				}
				else if (drug == "ecstasy"){
					addition = " mg"
				}
				else {
					addition = "%"
				}
			}
			return ""+line_obj[i][1]+addition+"";
		});
		
	var svg = d3.select(".linegraph")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height_graph + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + height_graph + ")")
		.call(xAxis_line);
	
	svg.append("g")
		.attr("class", "y-axis")
		.call(yAxis_line)
		.append("text")
		.attr("class", "title")
		.attr("x", -60)
		.attr("y", -15)
		.text("");
	
	//add line path
	svg.append("path")
		.datum(line_obj)
		.attr("class", "line")
		.attr("d", line)
		.style("stroke", color_select[1]);
	
	//add line data points (dots)
	svg.selectAll(".dot")
		.data(line_obj.filter(function(d) {return d;}))
		.enter().append("circle")
		.attr("class", "dot")
		.attr("cx", line.x())
		.attr("cy", height_graph)
		.attr("r", 3)
		.style("stroke", color_select[1])
		.style("stroke-width", "2px")
		.on("mouseover", function(d, i){
			if (line_obj[i][1] != null && selected_short){
				tip.show(d,i);
			}
		})
		.on("mouseout", function(d, i){
			tip.hide;
			var tip_select = document.getElementsByClassName("d3-tip");
			for (var i = 0; i < tip_select.length; i++){
				tip_select[i].style.opacity = "0";
			}
		});
		
	svg.call(tip);
}


//fill data array with data per country over the years
function fill_line_array(d){
	if (d.properties["population"][year]){
		for (var i = 2007; i < 2015; i++){
			if (d.id == selected_short) {
				if (drug){
					if (topic != "prevalence"){
						line_obj.push([i, d.properties[topic][drug][i]]);
					}
					else {
						line_obj.push([i, d.properties[topic][drug][subsubtopic][subsubsubtopic][i]]);
					}
				}
				else {
					line_obj.push([i, d.properties[topic][subtopic][i]]);
				}
			}
			else if (!selected_short && d.id == "AUT"){
				line_obj.push([i, ""]);
			}
		}
	}
}

//on menu changes or country (re)select, change graph
function rescale_graph() {
	line_obj = [];
	
	//refill data array
	line_data.map(function(d) {fill_line_array(d)});
	
	var min = Infinity, max = -Infinity;
	
	for (var i = 0; i < line_obj.length; i++){
		if (line_obj[i][1] >= max && line_obj[i][1] != null){
			max = line_obj[i][1];
		}
		if (line_obj[i][1] <= min && line_obj[i][1] != null){
			min = line_obj[i][1];
		}
	}
	
	if (min == Infinity){
		selected_short = null;
		line_data.map(function(d) {fill_line_array(d)});
		min = null;
		max = null;
	}
	else {
		min = .95 * min;
		max = 1.05 * max;
	}
	
	//set y-domain
	y.domain([min,max]);
	
	//set line x-y's
	line = d3.svg.line()	
		.defined(function(d, i) {return line_obj[i][1] != null})
		.x(function(d, i) {return x(line_obj[i][0])})
		.y(function(d, i) {
			if(line_obj[i][1] == null){
				return height_graph;
			} 
			else{
				return y(line_obj[i][1])
			}
		});
	
	//transite y-axis, line, title and dots (high-light datum of selected year)
	var svg = d3.select(".linegraph").transition().duration(1500);
	
	svg.select(".y-axis")
		.call(yAxis_line);
		
	svg.selectAll(".line")
		.attr("d", line(line_obj))
		.style("stroke", color_select[1]);
	
	svg.selectAll(".title")
		.text(selected_long);
	
	svg.selectAll(".dot")
		.attr("cx", line.x())
		.attr("cy", line.y())
		.style("opacity", function(d, i){
			if (line_obj[i][1] == null){
				return "0";
			}
			else {
				return "1";
			}
		})
		.style("stroke", function(d, i){
			if (line_obj[i][0] != year || line_obj[i][1] == null || !selected_short){
				return color_select[1];
			}
			else {
				return "black";
			}
		})
		.style("stroke-width", function(d, i){
			if (line_obj[i][0] != year || line_obj[i][1] == null || !selected_short){
				return "2px";
			}
			else {
				return "10px";
			}
		})
}

//clear line graph
function unscale_graph(){
	y.domain([,]);
	
	line = d3.svg.line()
		.x(function(d, i) {return x(line_obj[i][0])})
		.y(function(d, i) {return height_graph});
	
	var svg = d3.select(".linegraph").transition().duration(1500);
	
	svg.select(".y-axis")
		.call(yAxis_line);	
		
	svg.select(".line")
		.attr("d", line(line_obj));
	
	svg.selectAll(".title")
		.text(selected_long);
	
	svg.selectAll(".dot")
		.attr("cx", line.x())
		.attr("cy", height_graph)
		.style("stroke", color_select[1])
		.style("stroke-width", "2px")
		.style("opacity", "1");		
}

//update style of selected year
function coloryear_graph(){
	if(selected_short){
		var svg = d3.select(".linegraph").transition().duration(1500);
		svg.selectAll(".dot")
			.style("stroke", function(d, i){
				if (line_obj[i][0] != year || !selected_short){
					return color_select[1];
				}
				else {
					return "black";
				}
			})
			.style("stroke-width", function(d, i){
				if (line_obj[i][0] != year || line_obj[i][1] == null){
					return "2px";
				}
				else {
					return "10px";
				}
			})
			.style("opacity", function(d, i){
				if(line_obj[i][1] == null){
					return "0";
				}
				else{
					return "1";
				}
			})
	}
}