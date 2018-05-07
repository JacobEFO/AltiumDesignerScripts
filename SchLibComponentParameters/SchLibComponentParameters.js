//..............................................................................
// 
// Author: 	Jacob E. Overgaard
// Email: 	jacob.overgaard.andersen@gmail.com
//
//
//
// Description: 
// 			
//			This script adds an array of parameters defined in ParamArray
//			By default the parameters are set to be hidden, this can be changed
//			by assesing Parameter.IsHidden = false;
// 			
//			
// Use:
//
//			In Altium Designer make your custom drop-down menu in library view,
//			mine is called "Scripts".
//			Under scripts add the function:
// 				SchLibComponentParameters.js with Main
//
//			Mark your component in the component library and press:
//				SchLibComponentParameters.js > Main
//
//..............................................................................

//..............................................................................

// Returns today's date in yyyy-mm-dd format
function DateToday(today){
	dd = today.getDate();
	mm = today.getMonth()+1; //January is 0!
	yyyy = today.getFullYear();
	
	if(dd < 10){
	    dd = '0' + dd
	} 

	if(mm<10) {
	    mm = '0' + mm
	} 

	return today = yyyy + "-" + mm + "-" + dd;
}

// Fetches all existing parameters
// Note the "Comment" field counts as a parameter
function GetParameters(Parameter, ParamIterator){
	result = [];

	while(Parameter != null){
		result.push(Parameter.Name);
		Parameter = ParamIterator.NextSchObject;
	}

	return result;
}

function Main(){
	var CurrentSheet, Component, Iterator, ParamIterator, Parameter;
	var ParamArray // Array of the desired parameters
	var result // Array of currently defined parameters

	var today, dd, mm, yyyy // Vars for date handling

	today = new Date();
	today = DateToday(today); // yyyy-mm-dd format

	// Parameters to insert to component
	ParamArray = [
		["Manufacturer", ""],
		["Manufacturer Part Number", ""],
		["Farnell Part Number", ""],
		["Digikey Part Number", ""],
		["Mouser Part Number", ""],
		["RSonline Part Number", ""],
		["LatestRevisionNote", "Creation"],
		["LatestRevisionDate", today],
		["Footprint", "=CurrentFootprint"],
		["Published", today],
		["Publisher", "JEO"],
		["PackageDescription", ""]
	];

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
		if(Parameter == null){
			ShowMessage("Parameter is null")
		}

		// Cycle through and find the current parameters
		result = GetParameters(Parameter, ParamIterator);
		
		// Calculate the missing parameters and insert them
		loop1: for(var i = 0; i < ParamArray.length; i++){
			loop2: for(var j = 0; j < result.length; j++){
				if(ParamArray[i][0] == result[j]){ // Parameter already exists
					j = 0;
					break loop2;
				}
				if(j == (result.length - 1)){
					Parameter = SchServer.SchObjectFactory(eParameter, eCreate_Default);
					Parameter.Name = ParamArray[i][0];
					Parameter.Text = ParamArray[i][1];
					Parameter.IsHidden = true;
					Component.AddSchObject(Parameter)
				}
			}
		}
	}else{
		ShowMessage("Oops something went wrong. Seems like Component is NULL")
	}

	Component.SchIterator_Destroy(ParamIterator)
	CurrentSheet.SchIterator_Destroy(Iterator);
}