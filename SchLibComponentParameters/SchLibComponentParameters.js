//..............................................................................
// 
// Author: Jacob E. Overgaard
// Email: jacob.overgaard.andersen@gmail.com
//
// Description: 
//
//
//
// 
//..............................................................................

//..............................................................................
function FetchParameter(){
}

function SetParameter(){
}

function Main(){
	var CurrentSheet, Component, Iterator, ParamIterator, Parameter;
	var ParamArray // Array of the desired parameters
	var ToAdd // Array of the missing parameters

	var tmp, result, counter, greatloopcounter;

	// Parameters to insert to component
	ParamArray = [
		["Manufacturer", ""],
		["Manufacturer Part NUmber", ""],
		["Farnell Part Number", ""],
		["Digikey Part Number", ""],
		["Mouser Part Number", ""],
		["RSonline Part Number", ""],
		["LatestRevisionNote", ""],
		["LatestRevisionDate", ""],
		["Footprint", "=CurrentFootprint"],
		["Published", ""],
		["Publisher", ""],
		["PackageDescription", ""]
	];
	Toadd = [];

	if(SchServer == null){ return; }

	CurrentSheet = SchServer.GetCurrentSchDocument;
	if(CurrentSheet == null){  return; }

	result = [];

	Iterator = CurrentSheet.SchLibIterator_Create;
	Iterator.AddFilter_ObjectSet(MkSet(eSchComponent));

	Component = Iterator.FirstSchObject;

	if(Component != null){
		ParamIterator = Component.SchIterator_Create;
		ParamIterator.AddFilter_ObjectSet(MkSet(eParameter));

		Parameter = ParamIterator.FirstSchObject;

		// Cycle through and find the current parameters
		while(Parameter != null){
			if(Parameter.Name == "Comment"){
				
			}else{
				result.push(Parameter.Name);
			}
			Parameter = ParamIterator.NextSchObject;
		}

		Parameter = ParamIterator.FirstSchObject;
		if(Parameter == null){
			ShowMessage("NULL PARAMETER");
		}else{
			ShowMessage("We are not null here");
		}
		// Parameter.Name = "Test parameter";
		
		// Calculate the missing parameters
		counter = 0;
		greatloopcounter = 0;
		loop1: for(var i = 0; i < ParamArray.length; i++){
			loop2: for(var j = 0; j < result.length; j++){
				if(ParamArray[i][0] == result[j]){
					j = 0;
					break loop2;
				}else{
					counter += 1;
				}
				if(j == (result.length - 1)){
					// ShowMessage("j is result length - 1")
					// greatloopcounter += 1
					Parameter.Name = "LatestRevisionDate"
					// Parameter.Name = ParamArray[i][0];
					// Parameter = ParamIterator.NextSchObject;
				}
			}

		}
		ShowMessage("length of result " + result.length + "i is:" + i + "counter is " + counter + "greatloopcounter is " + greatloopcounter);


		// Parameter = ParamIterator.FirstSchObject;

		// Insert the missing parametrs
		// while(Parameter != null){
		// 	if(Parameter.Name == "Comment"){
		// 	}else{
		// 		result.push(Parameter.Name);
		// 	}
		// 	Parameter = ParamIterator.NextSchObject;
		// }

	}else{
		ShowMessage("Oops something went wrong. Seems like Component is NULL")
	}
	tmp = "";

	// for (var i = 0; i < result.length; i++){
	// 	tmp += result[i].toString() + "\n";
	// }

	// ShowMessage(tmp);

	Component.SchIterator_Destroy(ParamIterator)
	CurrentSheet.SchIterator_Destroy(Iterator);
}

