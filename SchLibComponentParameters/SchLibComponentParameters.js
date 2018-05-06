//..............................................................................
// Summary A simple hello world - an introduction to JScript language.
// Copyright (c) 2003 by Altium Limited
//..............................................................................

//..............................................................................
function FetchParameter(){
}

function SetParameter(){
}

function Main(){
	var CurrentSheet, Component, Iterator, ParamIterator, Parameter, result
	var ParamArray

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
	]
	if(SchServer == null){ return; }

	CurrentSheet = SchServer.GetCurrentSchDocument;
	if(CurrentSheet == null){  return; }

	result = "";

	Iterator = CurrentSheet.SchLibIterator_Create;
	Iterator.AddFilter_ObjectSet(MkSet(eSchComponent));

	Component = Iterator.FirstSchObject;

	if(Component != null){
		ParamIterator = Component.SchIterator_Create;
		ParamIterator.AddFilter_ObjectSet(MkSet(eParameter));

		Parameter = ParamIterator.FirstSchObject;

		while(Parameter != null){
			if(Parameter.Name == "Comment"){
				result += ""
			}else{
				result += Parameter.Name + " " + Parameter.Text + "\n";	
			}
			Parameter = ParamIterator.NextSchObject;
		}
	}else{
		ShowMessage("Oops something went wrong. Seems like Component is NULL")
	}
	ShowMessage(result);

	Component.SchIterator_Destroy(ParamIterator)
	CurrentSheet.SchIterator_Destroy(Iterator);
}

