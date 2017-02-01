//Legend inspired by Kai: https://bl.ocks.org/syntagmatic/e8ccca52559796be775553b467593a9f
// Programming project by Laura Veerkamp

var ctx, height_bar;
var legendheight, skipscale = false;
var duration = .25;
var rgbStart = [color_codes[0][0], color_codes[0][1]], rgbEnd;
var Step, opacityStep, opacitySteps = parseInt(60*duration);

//create continuous legend
function continuous(selector_id) {
	var legendwidth = 80,
		margin = {top: 10, right: 60, bottom: 10, left: 2};
		legendheight = 250;
	
	var colorscale = d3.scale.linear().range([color_select[1], color_select[0]]).domain([max, min]);
	
	height_bar = legendheight - margin.top - margin.bottom;
	width = legendwidth - margin.left - margin.right;

	var canvas = d3.select(selector_id)
		.style("height", legendheight + "px")
		.style("width", legendwidth + "px")
		.style("position", "relative")
		.append("canvas")
		.attr("height", height_bar)
		.attr("width", 1)
		.style("height", (height_bar) + "px")
		.style("width", (width) + "px")
		.style("position", "absolute")
		.style("top", (margin.top) + "px")
		.style("left", (margin.left) + "px")
		.node();

	var legendscale = d3.scale.linear()
		.range([1, height_bar])
		.domain(colorscale.domain());

	ctx = canvas.getContext("2d");
		
	//image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
	//define color over full length of legend
	var image = ctx.createImageData(1, legendheight);
	d3.range(legendheight).forEach(function(i) {
		var c = d3.rgb(colorscale(legendscale.invert(i)));
		image.data[4*i] = c.r;
		image.data[4*i + 1] = c.g;
		image.data[4*i + 2] = c.b;
		image.data[4*i + 3] = 255;
	});
	ctx.putImageData(image, 0, 0);
	
	//set-up values of legend
	var legendaxis = d3.svg.axis()
    .scale(legendscale)
	.orient("right")
	.ticks(6)
    .tickSize(0);

	svg = d3.select(selector_id)
		.append("svg")
		.attr("height", (legendheight) + "px")
		.attr("width", (legendwidth) + "px")
		.style("position", "absolute")
		.style("left", "0px")
		.style("top", "0px")

	svg
		.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (width + 3) + "," + (margin.top) + ")")
		.call(legendaxis);
};

//update legend (depending on skip just the values)
function rescale_legend(dataRange, skip){
	opacityStep = 0;
	rgbEnd = color_select;
	skipscale = false;
	if (skip == null){
		skipscale = true;
	}
	//fade-out
	Step = "first";
	requestAnimationFrame(animate);
	// fade-in
	setTimeout(function(){
		opacityStep = 0;
		delete_old();
		add_new();
		requestAnimationFrame(animate);
	}, (duration+.30)*1000);
}

//remove legend after fade-out
function delete_old(){
	var grandparent = document.getElementById("legend");
	var parent = document.getElementsByTagName("svg");
	for (var i = 0; i < parent.length; i++){
		if (parent[i].parentNode == grandparent){
			var child = document.getElementsByTagName("g");
			for (var j = 0; j < child.length; j++){
				if (child[j].parentNode == parent[i]){
					var node = child[j];
					node.parentNode.removeChild(node);
				}
			}
		}
	}
}

//add legend before fade-in
function add_new(){
	var colorscale = d3.scale.linear()
		.range([rgbEnd[1], rgbEnd[0]])
		.domain([max, min]);
	
	var legendscale = d3.scale.linear()
		.range([1, height_bar])
		.domain(colorscale.domain());
	
	legendaxis = d3.svg.axis()
		.scale(legendscale)
		.orient("right")
		.ticks(6)
		.tickSize(0);
	
	svg
		.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (width + 3) + "," + 10 + ")")
		.call(legendaxis);
}

//update opacity sixty times a second
function animate(time){	
	var opacity = 100*(opacityStep/opacitySteps);
	if (opacityStep >= opacitySteps - 1){ opacity = 100; }
	
	//fade-in
	if (Step == "first"){
		ctx.globalAlpha = (100-opacity)/100;
		var colorscale = d3.scale.linear()
		.range([rgbStart[1], rgbStart[0]])
		.domain([max, min]);
	}
	//fade-out
	else if (Step == "second"){
		ctx.globalAlpha = (opacity)/100;
		var colorscale = d3.scale.linear()
		.range([rgbEnd[1], rgbEnd[0]])
		.domain([max, min]);
	}
	//fade legend colors
	if (skipscale == false){
		ctx.clearRect(0,0,width, height_bar);	
		
		var legendscale = d3.scale.linear().range([1, height_bar]).domain(colorscale.domain());
		
		var image = ctx.createImageData(1, legendheight);
		d3.range(legendheight).forEach(function(i) {
			var c = d3.rgb(colorscale(legendscale.invert(i)));
			image.data[4*i] = c.r;
			image.data[4*i + 1] = c.g;
			image.data[4*i + 2] = c.b;
			image.data[4*i + 3] = Number(ctx.globalAlpha*255);
		});
		ctx.putImageData(image, 0, 0);
	}
	//fade values
	var grandparent = document.getElementById("legend");
	var parent = document.getElementsByTagName("svg");
	for (var i = 0; i < parent.length; i++){
		if (parent[i].parentNode == grandparent){
			var child = document.getElementsByTagName("g");
			for (var j = 0; j < child.length; j++){
				if (child[j].parentNode == parent[i]){
					var node = child[j];
					node.style.opacity = ctx.globalAlpha;
				}
			}
		}
	}
	//end opacity updating
	if(++opacityStep >= opacitySteps){
		ctx.globalAlpha = 1.00;
		if (Step == "second"){
			rgbStart = rgbEnd;
		}
		Step = "second";		
		return;
	}
	
	requestAnimationFrame(animate);	
}
