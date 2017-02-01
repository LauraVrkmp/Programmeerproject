// Inspired by Mike Bostock: http://bl.ocks.org/mbostock/3885304
// Programming project by Laura Veerkamp

var obj = {}, sorted = {};
var bar_data;
var height_bar, x_bar, y_bar, xAxis_bar, yAxis_bar;

// set up barchart with initial setting
function setBarchart(max, world){
	var margin = {top: 20, right: 10, bottom: 60, left: 90},
		width = 800 - margin.left - margin.right;
	height_bar = 300 - margin.top - margin.bottom;
		
	var chart = d3.select(".barchart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height_bar + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	//load data from world.hires.topo.json
	bar_data = topojson.feature(world, world.objects.world).features;
	
	//fill array with data of initial setting
	bar_data.map(function(d) {fill_data_array(d)});
	
	//sort array in new array
	sorted = sortObj(obj);
	
	x_bar = d3.scale.ordinal()
		//set domain by sorted countries
		.domain(sorted.map(function(d, i) {return sorted[i][0]}))
		.rangeRoundBands([0, width], .1);
	y_bar = d3.scale.linear()
		.domain([0,max])
		.range([height_bar, 0]);
		
	xAxis_bar = d3.svg.axis().scale(x_bar).orient("bottom");
	yAxis_bar = d3.svg.axis().scale(y_bar).orient("left");
	
	chart.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + height_bar + ")")
		.call(xAxis_bar)
		.selectAll("text")
		.attr("transform", "rotate(-45) translate(-8,0)")
		.style("text-anchor", "end");
	
	chart.append("g")
		.attr("class", "y-axis")
		.call(yAxis_bar);
	
	//define d3 tip
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.style("margin-top", "-5px")
		.html(function(d, i){
			//return unknown if no data
			if (sorted[i][1] == null){
				return "unknown";
			}
			else {
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
				//return data plus optional addition
				return ""+sorted[i][1]+addition+"";
			}
		})
	chart.call(tip);
	
	//add bars, fill according to selected topic
	var bar = chart.selectAll(".bar")
		.data(sorted)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d, i) {return x_bar(sorted[i][0])})
		.attr("y", function(d, i) {return y_bar(sorted[i][1])})
		.attr("height", function(d, i) {return height_bar - y_bar(sorted[i][1])})
		.attr("width", x_bar.rangeBand())
		.style("fill", color_select[0])
		.on("mouseover", function(d, i){
			if (selected_short != sorted[i][0]) {
				d3.select(this).style("fill", color_select[1]);
			}
			tip.show(d, i);
		})
		.on("mouseout", function(d, i){
			if (selected_short != sorted[i][0]) {
				d3.select(this).style("fill", color_select[0]);
			}
			tip.hide()
		});
}

//fill data array dependent on settings
function fill_data_array(d){
	if (d.properties["population"][year]){
		var name = d.id;
		if (drug){
			if (topic != "prevalence"){
				obj[name] = d.properties[topic][drug][year];
			}
			else {
				obj[name] = d.properties[topic][drug][subsubtopic][subsubsubtopic][year];
			}
		}
		else {
			obj[name] = d.properties[topic][subtopic][year];
		}
	}
}

//sort data array on data
function sortObj(object) {
	var sortable = [];
	for (var country in object)
		sortable.push([country, object[country]])

	sortable.sort(function(a, b) {
		return b[1] - a[1]
	})
	return sortable;
}

//bar chart transition on setting change
function rescale_bar(max) {
	//refill sorted data array
	obj = {};
	bar_data.map(function(d) {fill_data_array(d)});
	sorted = sortObj(obj);
	
	//redefine axes domains
	x_bar.domain(sorted.map(function(d, i) {return sorted[i][0]}));
	y_bar.domain([0,max]);
	
	var bar = d3.select(".barchart").transition().duration(1500);
	
	//transition of bars
	bar.selectAll(".bar")
		.attr("y", function(d, i) {return y_bar(sorted[i][1])})
		.attr("height", function(d, i) {return height_bar - y_bar(sorted[i][1])})
		.style("fill", function(d, i) {
			if (sorted[i][0] != selected_short){
				return color_select[0];
			}
		})
	//transition of axes
	bar.select(".x-axis")
		.attr("dx", "-1em")
		.call(xAxis_bar)
		.selectAll("text")
		.attr("transform", "translate(-10,10)")
		.attr("transform", "rotate(-45)")
		.style("text-anchor", "end");
	bar.select(".y-axis")
		.call(yAxis_bar);
}

//recolor bar of selected country
function recolor_selection(){
	
	var bar = d3.select(".barchart").transition().duration(500);
	
	bar.selectAll(".bar")
		.style("fill", function(d, i){
			if (sorted[i][0] == selected_short){
				return "black";
			}
			else {
				return color_select[0];
			}
		})
}