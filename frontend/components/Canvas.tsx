import  { useCallback, useEffect, useState } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { setBoardData } from "../src/api/task";
import { useParams } from "react-router-dom";
import debounce from "lodash/debounce";
import useDeepCompareEffect from "use-deep-compare-effect";
import { toast } from "sonner";

const Canvas = ({ initialData }: { initialData: string }) => {
  const params = useParams(); // Fixed typo from 'prams' to 'params'
  const taskId = params.taskid;
  const [whiteBoard, setWhiteBoard] = useState<
    readonly ExcalidrawElement[] | null
  >([]);
  console.log("whiteBoard", whiteBoard);

  const saveData = useCallback(async () => {
    if (!taskId) return;
    const finalElements = whiteBoard?.filter((element: ExcalidrawElement) => !element.isDeleted);
    try {
      await setBoardData(taskId, finalElements);
      toast.success("Board saved successfully.");
      console.log("Board data saved successfully.");
    } catch (error) {
      console.error("Error saving board data:", error);
    }
  }, [taskId, whiteBoard]);

  const debouncedSaveData = useCallback(debounce(saveData, 1000), [saveData]);


  useDeepCompareEffect(() => {
    debouncedSaveData();
    return () => {
      debouncedSaveData.cancel();
    };
  }, [debouncedSaveData, whiteBoard]); 


  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isSaveShortcut = isMac
        ? event.metaKey && event.key === "s"
        : event.ctrlKey && event.key === "s";

      if (isSaveShortcut) {
        event.preventDefault();
        saveData(); 
      }
    },
    [saveData]
  );

  useEffect(() => {
    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div style={{ height: "93vh", position: "relative" }}>
      <Excalidraw
        theme="dark"
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
            saveAsImage: false,
          },
        }}
        onChange={(excaliDrawElements) => {
          console.log("Elements changed");
          setWhiteBoard(excaliDrawElements);
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.Help />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
        <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint />
          <WelcomeScreen.Hints.ToolbarHint />
          <WelcomeScreen.Hints.HelpHint />
        </WelcomeScreen>
      </Excalidraw>
    </div>
  );
};

export default Canvas;
