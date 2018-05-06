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
function DateToday(today){
	// today = new Date();
	dd = today.getDate();
	mm = today.getMonth()+1; //January is 0!
	yyyy = today.getFullYear();
	
	if(dd < 10){
	    dd = '0' + dd
	} 

	if(mm<10) {
	    mm = '0' + mm
	} 

	today = yyyy + "-" + mm + "-" + dd;
	return today
}

function GetParameters(Parameter){
	
}

function Main(){
	var CurrentSheet, Component, Iterator, ParamIterator, Parameter;
	var ParamArray // Array of the desired parameters
	var result // Array of currently defined parameters

	var today, dd, mm, yyyy // Vars for date handling

	today = new Date();
	today = DateToday(today);

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

		// Cycle through and find the current parameters
		while(Parameter != null){
			if(Parameter.Name == "Comment"){
				// Do nothing
			}else{
				result.push(Parameter.Name);
			}
			Parameter = ParamIterator.NextSchObject;
		}
		
		// Calculate the missing parameters
		loop1: for(var i = 0; i < ParamArray.length; i++){
			loop2: for(var j = 0; j < result.length; j++){
				if(ParamArray[i][0] == result[j]){
					j = 0;
					break loop2;
				}
				if(j == (result.length - 1)){
					Parameter = SchServer.SchObjectFactory(eParameter, eCreate_Default);
					Parameter.Name = ParamArray[i][0];
					Parameter.Text = ParamArray[i][1];
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

