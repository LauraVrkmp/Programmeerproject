/*
    D3.js Slider
    Inspired by jQuery UI Slider
    Copyright (c) 2013, Bjorn Sandvik - http://blog.thematicmapping.org
    BSD license: http://opensource.org/licenses/BSD-3-Clause
*/

(function (root, factory) {
    root.d3.slider = factory(root.d3);
}(this, function (d3) {
return function module() {
  "use strict";

  // Public variables width default settings
  var min = 2007,
      max = 2014,
      step = 1,
      orientation = "horizontal",
      axis = true,
      margin = 50,
      value,
      active = 1,
      snap = true,
      scale,
	  datapos = '0.00%';

  // Private variables
  var axisScale,
      dispatch = d3.dispatch("slide"),
      formatPercent = d3.format(".2%"),
      tickFormat = d3.format(".0"),
      handle,
      sliderLength;

  function slider(selection) {
    selection.each(function() {

      // Create scale if not defined by user
      if (!scale) {
        scale = d3.scale.linear().domain([min, max]);
      }

      // DIV container
      var div = d3.select(this).classed("d3-slider d3-slider-" + orientation, true);
      
      var drag = d3.behavior.drag();

      // Slider handle
      handle = div.append("a")
          .classed("d3-slider-handle", true)
          .attr("xlink:href", "#")
          .attr('id', "handle-one")
          .on("click", stopPropagation)
          .call(drag);
      
      // Horizontal slider
      if (orientation === "horizontal") {

        div.on("click", onClickHorizontal);
		handle.style("left", formatPercent(scale(value)));
		drag.on("drag", onDragHorizontal);        
        sliderLength = parseInt(div.style("width"), 10);

      }
      
      if (axis) {
        createAxis(div);
      }


      function createAxis(dom) {

        // Create axis if not defined by user
        if (typeof axis === "boolean") {

          axis = d3.svg.axis()
              .ticks(Math.round(sliderLength / 50))
              .tickFormat(tickFormat)
              .orient("bottom");

        }

        // Copy slider scale to move from percentages to pixels
        axisScale = scale.ticks ? scale.copy().range([0, sliderLength]) : scale.copy().rangePoints([0, sliderLength], 0.5);
          axis.scale(axisScale);

          // Create SVG axis container
        var svg = dom.append("svg")
            .classed("d3-slider-axis d3-slider-axis-" + axis.orient(), true)
            .on("click", stopPropagation);

        var g = svg.append("g");

        // Horizontal axis
          svg.style("margin-left", -margin + "px");

          svg.attr({
            width: sliderLength + margin * 2,
            height: margin
          });

          if (axis.orient() === "top") {
            svg.style("top", -margin + "px");
            g.attr("transform", "translate(" + margin + "," + margin + ")");
          } else { // bottom
            g.attr("transform", "translate(" + margin + ",0)");
          }

        g.call(axis);

      }

      function onClickHorizontal() {
        if (toType(value) != "array") {
          var pos = Math.max(0, Math.min(sliderLength, d3.event.offsetX || d3.event.layerX));
          moveHandle(scale.invert ? 
                      stepValue(scale.invert(pos / sliderLength))
                    : nearestTick(pos / sliderLength));
        }
      }

      function onDragHorizontal() {
        var pos = Math.max(0, Math.min(sliderLength, d3.event.x));
        moveHandle(scale.invert ? 
                    stepValue(scale.invert(pos / sliderLength))
                  : nearestTick(pos / sliderLength));
      }

      function stopPropagation() {
        d3.event.stopPropagation();
      }

    });
  }

  // Move slider handle on click/drag
  function moveHandle(newValue) {
    var currentValue = toType(value) == "array"  && value.length == 2 ? value[active - 1]: value,
        oldPos = formatPercent(scale(stepValue(currentValue))),
        newPos = formatPercent(scale(stepValue(newValue))),
        position = "left";
    if (oldPos !== newPos) {
		datapos = newPos
		if (d3.event) {
			dispatch.slide(d3.event.sourceEvent || d3.event, value = newValue);
			localStorage.setItem("year", value);
		};
	}

	if ( active === 1 ) {
		handle.transition()
			  .styleTween(position, function() { return d3.interpolate(oldPos, newPos); });
		}
	}
 

  // Calculate nearest step value
  function stepValue(val) {

    if (val === scale.domain()[0] || val === scale.domain()[1]) {
      return val;
    }

    var alignValue = val;
    if (snap) {
      alignValue = nearestTick(scale(val));
    } else{
      var valModStep = (val - scale.domain()[0]) % step;
      alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= step) {
        alignValue += (valModStep > 0) ? step : -step;
      }
    };
    return alignValue;

  }

  // Find the nearest tick
  function nearestTick(pos) {
    var ticks = scale.ticks ? scale.ticks() : scale.domain();
    var dist = ticks.map(function(d) {return pos - scale(d);});
    var i = -1,
        index = 0,
        r = scale.ticks ? scale.range()[1] : scale.rangeExtent()[1];
    do {
        i += 1;
        if (Math.abs(dist[i]) < r) {
          r = Math.abs(dist[i]);
          index = i;
        };
    } while (dist[i] > 0 && i < dist.length - 1);

    return ticks[index];
  };

  // Return the type of an object
  function toType(v) {
    return ({}).toString.call(v).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  // Getter/setter functions
  slider.min = function(_) {
    if (!arguments.length) return min;
    min = _;
    return slider;
  };

  slider.max = function(_) {
    if (!arguments.length) return max;
    max = _;
    return slider;
  };

  slider.step = function(_) {
    if (!arguments.length) return step;
    step = _;
    return slider;
  };

  slider.orientation = function(_) {
    if (!arguments.length) return orientation;
    orientation = _;
    return slider;
  };

  slider.axis = function(_) {
    if (!arguments.length) return axis;
    axis = _;
    return slider;
  };

  slider.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return slider;
  };

  slider.value = function(_) {
    if (!arguments.length) return value;
    if (value) {
      moveHandle(stepValue(_));
    };
    value = _;
    return slider;
  };

  slider.snap = function(_) {
    if (!arguments.length) return snap;
    snap = _;
    return slider;
  };

  slider.scale = function(_) {
    if (!arguments.length) return scale;
    scale = _;
    return slider;
  };

  d3.rebind(slider, dispatch, "on");

  return slider;

}
}));