import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import React from "react";

const Canvas = ({ initialData, access }: { initialData: string, access: "view" | "edit" }) => {

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
                elements: JSON.parse(initialData),
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
