// Programming project by Laura Veerkamp

//response to button clicking
function buttonchange(id){
	//unselect if clicked drug was already selected
	if(selection==id){
		selection = 0;
		document.getElementById('nodrugselected').style.visibility="visible",
		document.getElementById('drugselected').style.visibility="hidden",
		document.getElementById(id).style.background = "";
	}
	//select clicked drug by updating background, change visibility of dropdown menues 
	else{
		var array = ['button1', 'button2', 'button3', 'button4'];
		for (var i in array){
			if (array[i] == id){
				array.splice(i, 1);
			}
		}
		for (var i in array){
			document.getElementById(array[i]).style.background = "";
		}
		document.getElementById(id).style.background = "black",
		document.getElementById('nodrugselected').style.visibility="hidden",
		document.getElementById('drugselected').style.visibility="visible"	
		selection = id;
	}
}

//uncheck all the radio buttons in the same class, check the one clicked
function recheck(id, name){
	var array = []
	var number = Number(name.substr(name.length - 1));
	for(var i = 1; i < number+1; i++){
		if(i != id){
			array.push(i);
		}
	}
	for (var i in array){
		document.getElementById(array[i]).checked = false;
	}
	document.getElementById(id).checked = true;
}