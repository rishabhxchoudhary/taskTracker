import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { BinaryFiles } from "@excalidraw/excalidraw/types/types";
import React from "react";

interface WhiteBoardData {
  elements: ExcalidrawElement[];
  files?: BinaryFiles;
}

interface CanvasProps {
  initialData: WhiteBoardData;
  access: "view" | "edit";
}
const Canvas = ({ initialData, access }: CanvasProps) => {

  const [, setWhiteBoard] = React.useState<
      readonly ExcalidrawElement[] | null
    >([]);
  
  return (
    <div id="whiteboard" style={{ height: "93vh", position: "relative" }}>
      <Excalidraw
        theme="dark"
        viewModeEnabled={access == "view"}
        initialData={
          initialData
            ? {
                elements: initialData.elements,
                appState: { viewBackgroundColor: "#1e20" },
                files: initialData.files
              }
            : undefined
        }
        UIOptions={{
          canvasActions: {
            export: false,
            loadScene: false,
            saveAsImage: true,
          },
        }}
        onChange={(excaliDrawElements) => {
          setWhiteBoard(excaliDrawElements);
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Help />
        </MainMenu>
      </Excalidraw>
    </div>
  );
};

export default Canvas;
