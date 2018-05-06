{Creeated by Simon King 2017

Batch generates all containers in the current open Outjob
Must turn off Camtastic Autoload and open as Camtastic loading will terminate script before completion.
Might be ok i made the last container?

last edit 2017-09-13 by Dennis Saputelli added confirmation dialog as this could run a while
   added button icon
}

procedure OutputJobBatch();

uses
    SysUtils;
    IniFiles;

var
    Workspace           : IWorkspace;
    projDocument        : IDocument;
    projOutput          : IWSM_OutputJobDocument;
    i                   : Integer;
    buttonSelected      : Integer;

begin
  // Show a confirmation dialog
  buttonSelected := messagedlg(
    'Proceed with Batch Output Generation?'+ #10#13+'Might take a while...'+#10#13+#10#13+
    'This script is going to batch generate all of the outputs in the currently open Outjob.'+#10#13+#10#13+
    'Must turn off "Camtastic Autoload" before running.'+#10#13+#10#13+
    'Suggest to turn off "Open Generated Outputs" and "Open PDF after export" so you can watch progress.'+#10#13,
     mtWarning, mbOKCancel, 0);

  if buttonSelected = mrCancel then Exit;
  if buttonSelected = mbOK then;

    begin
        Workspace  := GetWorkspace;
        if (Workspace = nil) then
        begin
            ShowError('Unable to find current workspace.');
            Exit;
        end;

        projDocument := Workspace.DM_FocusedDocument;

        if (projDocument.DM_DocumentKind <> 'OUTPUTJOB') then
        begin
            ShowError('Document is not an Output Job File.');
            Exit;
        end;
        projOutput  := Workspace.DM_GetOutputJobDocumentByPath(projDocument.DM_FullPath);

        for i := 1 to (projOutput.OutputMediumCount - 1) do
        begin
            if (projOutput.OutputMedium(i).TypeString = 'PDF') then
            begin
                ResetParameters;
                AddStringParameter ('Action'                 , 'PublishToPDF');
                AddStringParameter ('OutputMedium'           , projOutput.OutputMedium(i).Name);
                AddStringParameter ('ObjectKind'             , 'OutputBatch');
                AddStringParameter ('DisableDialog'          , 'True');
                AddStringParameter ('OpenOutput'             , 'False');
                RunProcess('WorkspaceManager:Print');
                Sleep(1000);
            end;

            if (projOutput.OutputMedium(i).TypeString = 'Generate Files') then
            begin
                ResetParameters;
                AddStringParameter ('Action'                 , 'Run');
                AddStringParameter ('OutputMedium'           , projOutput.OutputMedium(i).Name);
                AddStringParameter ('ObjectKind'             , 'OutputBatch');
                AddStringParameter ('DisableDialog'          , 'True');
                RunProcess('WorkspaceManager:GenerateReport');
                Sleep(1000);
            end;
        end;
    end;
  end;

end;

