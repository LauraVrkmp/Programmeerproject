//Programming project by Laura Veerkamp

var selection = null;
var nodrug_value = "deaths";
var drug_value = "prevalence";

//hide all radio buttons
function hidecheckboxes(){
	var HSR = document.getElementsByClassName("HSR");
	for (var i = 0; i < HSR.length; i++){HSR[i].style.visibility = "hidden"};
	var deaths = document.getElementsByClassName("deaths");
	for (var i = 0; i < deaths.length; i++){deaths[i].style.visibility = "hidden"};
	var disease = document.getElementsByClassName("disease");
	for (var i = 0; i < disease.length; i++){disease[i].style.visibility = "hidden"};
	var prevalence = document.getElementsByClassName("prevalence");
	for (var i = 0; i < prevalence.length; i++){prevalence[i].style.visibility = "hidden"};
}

//on drug selection, change visible dropdown menu, lay-out of buttons
function buttonchange(id){
	if(selection==id){
		selection = null;
		document.getElementById("nodrugselected").style.visibility="visible",
		document.getElementById("drugselected").style.visibility="hidden",
		document.getElementById(id).style.background = "";
		animateMap(null,id,null,null,selection);
		dropchange(nodrug_value);
	}
	else {
		if (selection == null){
			var back_up = null;
		}
		else {
			var back_up = "change";
		}
		
		var array = ["button1", "button2", "button3", "button4"];
		for (var i in array){
			if (array[i] == id){
				array.splice(i, 1);
			}
		}
		for (var i in array){
			document.getElementById(array[i]).style.background = "";
		}
		document.getElementById(id).style.background = "#381302",
		document.getElementById("nodrugselected").style.visibility="hidden",
		document.getElementById("drugselected").style.visibility="visible"	
		selection = id;
		animateMap(null,id,null,null,selection);
		dropchange(drug_value, back_up);
	}
}

//on change of dropdown value (topic), indicate change by 'back-up', 
//hide and show wished for radio buttons, update html text (topic specifics)
function dropchange(value, back_up){
	if (back_up != null){
		var back_up = null;
	}
	else {
		var back_up = "change";
	}
	if(value == "deaths"){
		nodrug_value = "deaths";
		hidecheckboxes();
		var deaths = document.getElementsByClassName("deaths");
		for (var i = 0; i < deaths.length; i++){deaths[i].style.visibility = "visible"};
	}
	if(value == "disease"){
		nodrug_value = "disease";
		hidecheckboxes();
		var disease = document.getElementsByClassName("disease");
		for (var i = 0; i < disease.length; i++){disease[i].style.visibility = "visible"};
		
	}
	if(value == "HSR"){
		nodrug_value = "HSR";
		hidecheckboxes();
		var HSR = document.getElementsByClassName("HSR");
		for (var i = 0; i < HSR.length; i++){HSR[i].style.visibility = "visible"};
	}
	if(value == "prevalence"){
		drug_value = "prevalence";
		hidecheckboxes();
		var prevalence = document.getElementsByClassName("prevalence");
		for (var i = 0; i < prevalence.length; i++){prevalence[i].style.visibility = "visible"};
	}
	if(value == "treatment"){
		drug_value = "treatment";
		hidecheckboxes();
	}
	if(value == "seizures"){
		drug_value = "seizures";
		hidecheckboxes();
	}
	if(value == "purity"){
		drug_value = "purity";
		hidecheckboxes();
	}
	animateMap(null,null,value,null,null,back_up);
	rescale_graph();
	specify(value,back_up);
}

//responses of radio buttons
function recheck(id){
	var id = id;
	var array = []
	var index = Number(id.substring(0,1));
	var total = Number(id.substring(2,3));
	var topic = id.substring(4);
	for(var i = 1; i < total+1; i++){
		if(i != index){
			array.push(i);
		}
	}
	for (var i in array){
		uncheck = array[i]+"/"+total+" "+topic;
		document.getElementById(uncheck).checked = false;
	}
	document.getElementById(id).checked = true;
	switch(id){
		case ("1/2 deaths"):
			id = "total";
			break;
		case ("2/2 deaths"):
			id = "mean_age";
			break;
		case ("1/2 disease"):
			id = "AIDS";
			break;
		case ("2/2 disease"):
			id = "HIV";
			break;
		case ("1/2 HSR"):
			id = "OST";
			break;
		case ("2/2 HSR"):
			id = "NSP";
			break;
		case ("1/3 prevalence"):
			id = "ever";
			break;
		case ("2/3 prevalence"):
			id = "year";
			break;
		case ("3/3 prevalence"):
			id = "month";
			break;
	}
	animateMap(null,null,null,id,null);
	rescale_graph();
}

//update html text (topic specifics)
function specify(value,back_up){
	var topic;
	if (value == 'deaths'){
		topic = "The data on drug related deaths concern numbers on deaths directly caused by illegal drugs and on mortality among drug users.<br><br>The radio buttons enable toggling between data on total death numbers and on the average age of mortality.<br><br>Obtained data from the EMCDDA."
	}
	else if (value == 'disease'){
		topic = "The data on drug related disease concern the number of notifications per year of either infectious disease AIDS or HIV.<br><br>The radio buttons enable toggling between the two.<br><br>Obtained data from the EMCDDA.";
	}
	else if (value == 'HSR'){
		topic = "The data on health and social responses concern the number of clients for either opioid substitution treatment (OST), or needle and syringe programmes (NSP).<br><br>The radio buttons enable toggling between the two.<br><br>The data indicate the degree of organised help coming from governments, as well as how big of a problem drug use is for the country.<br><br>Obtained data from the EMCDDA.";
	}
	else if (value == 'prevalence'){
		topic = "The drug specific data on the prevalence of use concern the percentage of the population that has been using the drug: ever in their lifetime, in the last year, or in the last month.<br><br>The radio buttons enable toggling between the three time span options.<br><br>Obtained data from the EMCDDA.";
	}
	else if (value == 'treatment'){
		topic = "The drug specific data on the treatment demand concern the number of clients for the specified drug.<br><br>Obtained data from the EMCDDA.";
	}
	else if (value == 'seizures'){
		topic = "The drug specific data on drug seizures concern the number of seizures made by all law enforcement agencies (police, customs etc.).<br><br>Obtained data from the EMCDDA.";
	}
	else if (value == 'purity'){
		topic = "The drug specific data on purity and potency concern the percentage of active compound for cannabis, cocaine and amphetamine (purity), and the amount of milligrams of MDMA in ecstasy (potency).<br><br>Obtained data from the EMCDDA.";
	}
	if (back_up != null){
	var written = document.getElementById("specific");
		written.style.opacity = 0;
		setTimeout(function(){
			written.innerHTML = topic;
			written.style.opacity = 1;
		},500);
	}
}