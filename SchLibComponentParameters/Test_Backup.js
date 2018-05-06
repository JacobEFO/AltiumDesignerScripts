//..............................................................................
// Summary A simple hello world - an introduction to JScript language.
// Copyright (c) 2003 by Altium Limited
//..............................................................................

//..............................................................................
function Main(){
	var CurrentSheet
	var Component
	var Iterator
	var Parameter
	var result

	if(SchServer != null){
		CurrentSheet = SchServer.GetCurrentSchDocument;

		if(CurrentSheet != null){
			Component = SchServer.ISch_Component;
			Parameter = SchServer.ISch_Parameter;
			Iterator = CurrentSheet.SchIterator_Create;

			// Iterator.AddFilter_ObjectSet(MkSet(eSchComponent));
			Iterator.SetState_IterationDepth(eIterateFirstLevel);
			Iterator.AddFilter_ObjectSet(MkSet(eParameter));

			Parameter = Iterator.FirstSchObject;

			result = "";
			while(Parameter != null){
				result += Parameter.Name + " " + Parameter.Text + "\n";
				Parameter = Iterator.NextSchObject;
			}
			ShowMessage(result);

			// CurrentSheet.SchIterator_Destroy(Iterator);

		}else{
			ShowMessage("Not a schematic");
		}
	}
	
	
}

