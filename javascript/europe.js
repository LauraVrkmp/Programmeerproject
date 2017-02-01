//Map dynamics inspired by Rich Donohue: http://bl.ocks.org/rgdonohue/9280446
// Programming project by Laura Veerkamp

var path, svg_map, color_undef = "#dddddd";
var topic = "deaths"; //initial setting
var subtopic = "total"; //initial setting
var subtopic1  = "total", subtopic2 = "AIDS", subtopic3 = "OST", subtopic4 = "ever"
var subsubtopic = "ever";
var subsubsubtopic = "all";
var drug;
var year = 2007; //initial setting
var min, max;
var selected_short;
var selected_long;

//set colors for different topics
var color_codes = 	[["#b3cde3", "#810f7c"],
					["#bae4bc", "#0868ac"],
					["#d7b5d8", "#980043"],
					["#fecc5c", "#bd0026"],
					["#fdcc8a", "#b30000"],
					["#b2e2e2", "#006d2c"],
					["#c2e699", "#006837"]];
var color_select = color_codes[0];
					
function init(){
	setMap();
}

//set-up map frame	
function setMap(){
	var width = 800, height = 600;
	
	var projection = d3.geo.equirectangular()
		.scale(860)
		.center([16, 57]);
	path = d3.geo.path()
		.projection(projection);
	
	svg_map = d3.select("#europe").append("svg")
	  .attr("width", width)
	  .attr("height", height)
	  .append("g");

	svg_map.append("defs").append("path") 
	  .attr("d", path);

	svg_map.append("path")
      .attr("d", path);
	
	loadData();
};

//load data from topo file and data set
function loadData() {
	queue()
	.defer(d3.json, "data/world.hires.topo.json")
	.defer(d3.json, "data/data.json")
	.await(processData);
}

//append data from data set to topo file
function processData(error,world,data) {
	var countries = world.objects.world.geometries;
	var json_data = data;
	var subtopics;
	
	var topics = ["HSR", "deaths", "disease", "population", "prevalence", "purity", "seizures", "treatment"];
	var subtopicsA = ["NSP", "OST"];
	var subtopicsB = ["mean_age", "total"];
	var subtopicsC = ["AIDS", "HIV"];
	var subtopicsD = ["amphetamines" , "cannabis", "cocaine", "ecstasy"];
	var subsubtopics = ["ever", "month", "year"];
	var subsubsubtopics = ["all", "young"];

	for (var i in countries){
		for (var j in topics){
			countries[i].properties[topics[j]] = {};
			if (topics[j] == "population"){
				for (var k in json_data[topics[j]]){
					if (countries[i].id == k){
						var topic_data = {};
						for (var m = 2007; m < 2015; m++){
							topic_data[m] = json_data[topics[j]][k][m];
						}
						countries[i].properties[topics[j]] = topic_data;
					}
				}
			}
			else if (topics[j] == "HSR" || topics[j] == "deaths" || topics[j] == "disease"){
				if (topics[j] == "HSR"){
					subtopics = subtopicsA;
				} 
				else if (topics[j] == "deaths"){
					subtopics = subtopicsB;
				}
				else if (topics[j] == "disease"){
					subtopics = subtopicsC;
				}
				for (var k in subtopics){
					countries[i].properties[topics[j]][subtopics[k]] = {};
					for (var l in json_data[topics[j]][subtopics[k]]){
						if (countries[i].id == l){
							var topic_data = {};
							for (var m = 2007; m < 2015; m++){
								topic_data[m] = json_data[topics[j]][subtopics[k]][l][m];
							}
							countries[i].properties[topics[j]][subtopics[k]] = topic_data;
						}
					}
				}
			}
			else {
				subtopics = subtopicsD;
				for (var k in subtopics){
					countries[i].properties[topics[j]][subtopics[k]] = {};
					if (topics[j] != "prevalence"){
						for (var l in json_data[topics[j]][subtopics[k]]){
							if (countries[i].id == l){
							var topic_data = {};
								for (var m = 2007; m < 2015; m++){
									topic_data[m] = json_data[topics[j]][subtopics[k]][l][m];
								}
								countries[i].properties[topics[j]][subtopics[k]] = topic_data;
							}
						}
					}
					else {
						for (var l in subsubtopics){
							countries[i].properties[topics[j]][subtopics[k]][subsubtopics[l]] = {};
							for (var m in subsubsubtopics){
								countries[i].properties[topics[j]][subtopics[k]][subsubtopics[l]][subsubsubtopics[m]] = {};
								for (var n in json_data[topics[j]][subtopics[k]][subsubtopics[l]][subsubsubtopics[m]]){
									if (countries[i].id == n){
										var topic_data = {};
										for (var o = 2007; o < 2015; o++){
											topic_data[o] = json_data[topics[j]][subtopics[k]][subsubtopics[l]][subsubsubtopics[m]][n][o];
										}
										countries[i].properties[topics[j]][subtopics[k]][subsubtopics[l]][subsubsubtopics[m]] = topic_data;
									}
								}
							}
						}
					}
				}
			}
		}
	}
	drawMap(world);
}

//draw map with initial setting
function drawMap(world){
	//create d3 tip, hand data corresponding to menu set-up
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.html(function(d, i) {return tip_data(d, i)});
	svg_map.call(tip);
	
	svg_map.selectAll(".country")
	.data(topojson.feature(world, world.objects.world).features)
	.enter().append("path")
	.attr("class", "country")
	.attr("id", function(d) {return "code_" + d.id; }, true)
	.attr("d", path);
	
	//min and maximum values of data, selected country
	var dataRange = getDataRange();
	var d3_select;
	
	//fill countries on data values, on click, mouseover and mouseout	
	d3.selectAll(".country")
	.attr("fill", function(d){
		if (!d.properties["population"][year] || d.properties[topic][subtopic][year] == null){
			return color_undef;
		}
		else {
			return getColor(d.properties[topic][subtopic][year], dataRange);
		}
	})
	.on("click", function(d, i){
		if (selected_short == d.id){
			selected_short = "";
			selected_long = "";
			d3.select(this).style("fill", "");
			//update line graph
			unscale_graph();
			//update bar chart
			recolor_selection();
		}
		else {
			if (selected_short != null){
				d3_select.style("fill", "");
			}
			d3.select(this).style("fill", "black");
			d3_select = d3.select(this);
			selected_short = d.id;
			selected_long = d.properties.name;
			//update line graph
			rescale_graph(world);
			//update bar chart
			recolor_selection();
		}
	})
	.on("mouseover", function(d, i){
		if (selected_short != d.id){
			d3.select(this).style("fill", "#381302")
		};
		var rect = this;
		tip.show(d,i);
		if (d.properties.name == "Russian Federation"){
			var tip_select = document.getElementsByClassName("d3-tip");
			for (var i = 0; i < tip_select.length; i++){
				tip_select[i].style.top = "190px";
				tip_select[i].style.left = "660px";
			};
		}
		if (d.properties.name == "Portugal"){
			var tip_select = document.getElementsByClassName("d3-tip");
			for (var i = 0; i < tip_select.length; i++){
				tip_select[i].style.left = "50px";
			};
		}
	})
	.on("mouseout", function(d, i){
		tip.hide; 
		var tip_select = document.getElementsByClassName("d3-tip");
		for (var i = 0; i < tip_select.length; i++){
			tip_select[i].style.opacity = "0";
		};
		if (selected_short != d.id){
			d3.select(this).style("fill", "")
		}
	});
	
	//draw continuous legend
	continuous("#legend");
	//initiate bar chart
	setBarchart(max, world);
	//initiate line graph
	setLinegraph(world);
}

//define min and max values of selected data
function getDataRange(){	
	min = Infinity, max = -Infinity;
	d3.selectAll(".country")
	.each(function(d,i){
		if (d.properties["population"][year]){
			if (topic == "population"){			
				var currentValue = d.properties[topic][year];
				if(currentValue <= min && currentValue){
					min = currentValue;
				}
				if(currentValue >= max && currentValue){
					max = currentValue;
				}
			}
			else if (topic == "HSR" || topic == "deaths" || topic == "disease"){	
				var currentValue = d.properties[topic][subtopic][year];
				if(currentValue <= min && currentValue){
					min = currentValue;
				}
				if(currentValue >= max && currentValue){
					max = currentValue;
				}
			}
			else if (topic != "prevalence"){
				var currentValue = d.properties[topic][drug][year];
				if(currentValue <= min && currentValue){
					min = currentValue;
				}
				if(currentValue >= max && currentValue){
					max = currentValue;
				}
			}
			else{
				var currentValue = d.properties[topic][drug][subsubtopic][subsubsubtopic][year];
				if(currentValue <= min && currentValue){
					min = currentValue;
				}
				if(currentValue >= max && currentValue){
					max = currentValue;
				}
			}
		}
	});
	return [min,max];
}

//returns color value within range of the selection color, in domain of min and max values
function getColor(valueIn, valuesIn){
	var color = d3.scale.linear()
	.domain([valuesIn[0],valuesIn[1]])
	.range([color_select[0],color_select[1]]);
	return color(valueIn);
}

//update figures
function sequenceMap(skip){
	var dataRange = getDataRange();
	//update legend (skip gradient if topic wasn't changed)
	rescale_legend(dataRange, color_select, skip);
	//update bar graph
	rescale_bar(dataRange[1]);
	//update map
	d3.selectAll(".country").transition()
	.duration(750)
	.attr("fill", function(d){
		if (drug){
			if (topic != "prevalence"){
				if (!d.properties["population"][year] || d.properties[topic][drug][year] == null){
					return color_undef;
				}
				else {
					return getColor(d.properties[topic][drug][year], dataRange);
				}
			}
			else {
				if (!d.properties["population"][year] || d.properties[topic][drug][subsubtopic][subsubsubtopic][year] == null){
					return color_undef;
				}
				else {
					return getColor(d.properties[topic][drug][subsubtopic][subsubsubtopic][year], dataRange);
				}
			}
		}
		else {
			if (!d.properties["population"][year] || d.properties[topic][subtopic][year] == null){
				return color_undef;
			}
			else {
				return getColor(d.properties[topic][subtopic][year], dataRange);
			}
		}
	})
}

//listener for menu changes
function animateMap(change_year, change_button, change_topic, change_radio, buttoncount, back_up) {
	if (change_year){
		//update map and lay-out of graph line
		year = change_year;
		sequenceMap()
		coloryear_graph();
	}
	if (change_button){
		//change selected drug
		if (drug && !buttoncount){
			drug = null;			
		}
		else {
			if (change_button == "button1"){
				drug = "cannabis";
			}
			else if (change_button == "button2"){
				drug = "cocaine";
			}
			else if (change_button == "button3"){
				drug = "amphetamines";
			}
			else {
				drug = "ecstasy";
			}
		}
		
	}
	if (change_topic){
		//change selected topic, update subtopic, color code
		topic = change_topic;
		if (topic == "deaths"){
			subtopic = subtopic1;
			color_select = color_codes[0];
		}
		if (topic == "disease"){
			subtopic = subtopic2;
			color_select = color_codes[1];
		}
		if (topic == "HSR"){
			subtopic = subtopic3;
			color_select = color_codes[2];
		}
		if (topic == "prevalence"){
			subsubtopic = subtopic4;
			color_select = color_codes[3];
		}
		if (topic == "purity"){
			color_select = color_codes[4];
		}
		if (topic == "seizures"){
			color_select = color_codes[5];
		}
		if (topic == "treatment"){
			color_select = color_codes[6];
		}
		sequenceMap(back_up);
	}
	if (change_radio){
		//change subtopic if not already selected, preserve selection in other subtopic windows
		if (change_radio != subtopic1 && change_radio != subtopic2 && change_radio != subtopic3 && change_radio != subtopic4){
			if (change_radio == "total" || change_radio == "mean_age"){
				subtopic1 = change_radio;
				subtopic = change_radio;
				sequenceMap();
			}
			if (change_radio == "AIDS" || change_radio == "HIV"){
				subtopic2 = change_radio;
				subtopic = change_radio;
				sequenceMap();
			}
			if (change_radio == "OST" || change_radio == "NSP"){
				subtopic3 = change_radio;
				subtopic = change_radio;
				sequenceMap();
			}
			if (change_radio == "ever" || change_radio == "year" || change_radio == "month"){
				subtopic4 = change_radio;
				subsubtopic = change_radio;
				sequenceMap();
			}
		}
	}
};

//define tip data corresponding to menu set-up, including optional addition
function tip_data(d, i){
	var data = "unknown";
	if (drug){
		if (topic != "prevalence"){
			if (d.properties["population"][year] && d.properties[topic][drug][year] != null){
				data = d.properties[topic][drug][year]
			}
		}
		else {
			if (d.properties["population"][year] && d.properties[topic][drug][subsubtopic][subsubsubtopic][year] != null){
				data = d.properties[topic][drug][subsubtopic][subsubsubtopic][year]
			}
		}
	}
	else {
		if (d.properties["population"][year] && d.properties[topic][subtopic][year] != null){
			data = d.properties[topic][subtopic][year]
		}
	}
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
	if (data == "unknown"){
		addition = ""
	}
	return "<strong>"+d.properties.name+":</strong> "+data+addition;
}

window.onload = init();