## Report on programming project by Laura Veerkamp

### Description

In my project I aimed to insightfully display data on seven drug related topics for European countries, plus Norway and Turkey. This is done by three visualization: a map of Europe, a line graph for a country specific trend over the years and a bar chart for easy comparison between countries for a given year. A menu enables data selection per year and per (sub)topic, some of which are specific for one out of four different drugs. Lastly, a short description for each topic helps the user orientate on what they're seeing.

![screenshot](/doc/screenshot.JPG)

### Technical design

The visualization is set up by four JavaScript files (europe.js plus legend.js, barchart.js, linegraph.js) that enable responding to the menu. The functionalities in the menu are controlled in buttons.js, while the actual response they will trigger in the visualizations and inner html is determined by responses.js. Europe.js keeps track of which data is selected in global variables (in terms of the year, the topic, subtopic, subsubtopic and subsubsubtopic). All visualizations are able to select the data depending on those variables.  

On window load, in europe.js the data for the visualizations is obtained from a json file and appended to the topojson required for the map of Europe. The initial setting is on the topic of total (var subtopic) drug related deaths (var topic, with corresponding coloring), for the year of 2007 (var year), not for any country specifically. That data is used to set up the map of Europe and the bar chart, while the line graph is initiated without any data but the sequence of years appended. Only after selecting a country will the line graph dynamically respond.

A change of year on the slider (slider.js) will reset the value for year in index.html, calling the animateMap function in europe.js. This function also takes in changes in selected drug, topic and radio buttons (subtopic) to call for appropriate responses of all three figures. If the map changes (sequenceMap), the bar chart and legend change (though only it's values if the overall topic stays the same). For any change on the bar chart, the values on the x-axis are resorted and the maximum value of the y-axis is updated, both of the changes resulting in a transition of the bars sorted big to small still. If the year changes with a country selected, the dots of the line graph are resized and colored (coloryear_graph), while if anything else changes the line responds accordingly (rescale_graph). If a country is deselected, unscale_graph brings down the line and removes the graph header and y-axis values. 

### Challenges and changes to the document design

With the bar chart and line graph both a topics trend as its comparison to other countries for one year specifically is visualized. For each figure a specific response to the menu changes was required. This implementation was successful.

I decided to add these figures to the side of the map of Europe, instead over overlapping the map on country selection, which would have limited the options of responsivity as no different country would then have been selectable before the user returns to the map. Also, displaying the figures all together allows for a more insightful impression of the data.

Instead of loading a page with no data selected yet, I picked a topic, subtopic and year on window load, since this set-up would appeal to the user more and would invite to explore the data set further.

The concern was expressed for communicating the right unit of measurement for each topic. This was resolved by appending an addition to the d3 tip in all three visualizations, and by mentioning it in the accompanying text for topics specifically.

With the given data set, there was no need or time to implement arcs and/or chords in between countries, to indicate drugs origins. The data set as it is was complex enough on itself.

The data set was not fully exploited. In the topic of the prevalence of drug use, there was also data on the younger age group of 15-25 year olds. The bar chart could have been grouped to compare the full population to the younger age group, but I decided not to because it would imply an information overload.

The same goes into account for the total drug related deaths. There were numbers available for deaths caused by opiates, by non-opiates and caused by unknown substances, but this bulk of information would have been hardly interpretable and was left out of the data.json all together.

For some of the data topics a correction for population size was aimed for (total overdose deaths, disease notifications, health and social responses, treatment demand and the seizure of drugs). Sometimes the correction would not have made any sense, since the uncorrected data tells you more about a countries policy, such as the amount of drug seizures. Also in other cases, a correction would have been slightly inappropriate, as with the data on total overdose deaths. Here, each individual is of course one too many. Thus, no corrections were applied for now.

Initially I wanted to show the sum of notifications of HIV and AIDS, stacking the bar chart and line graph. The two were, upon rethought, too diverse to compare and processed separately as subtopics.

There was not enough data available on whether clients for drug treatment had a treatment history or not, so also this data specific was left out of view.

Lastly, no link was made between the amount of drug seizures per country and its policy on drugs in general. I found the policy of countries hard to quantify, thus it would have required large pieces of accompanying texts to include in the visualization. This would not have done the clarity of storytelling any good.


### Improve on current design

I easily managed to obtain my specified minimal viable product by including all the topics I aimed for, adding interactivity for both menu changes and country selection in the map of Europe. There is however improvement possible on the final product.

More interactivity would have been possible by updating the map and line graph upon country selection in the bar chart. The same goes for updating map, bar graph and time slider upon year selection in the line graph. Updating the time slider would have added a completely new element of interactivity, thus both forms of figure updating were left out for now.

In the current bar chart, it is sometimes not very clear for which country data is missing. The data value can also be very low compared to other countries. A more explicit 'unknown', is wished for.

Correcting for population size is a possibility to be further looked into.

Story telling wise, I did not manage to complement data of different topics as aimed for by this quote from the methods and definitions of the EMCDDA:

> In particular, information on patterns of drug use, 
	such as primary drug and injecting behavior, complement estimates of the 
	prevalence of problem drug use (PDU), drug-related infectious diseases (DRID) 
	and drug-related deaths (DRD).
	
The visualization does however do it's job on insightfully displaying data for each and every topic specifically. Whether the visualization manage to carefully depict reality is in my opinion now mostly dependant on the quality of the data source.
