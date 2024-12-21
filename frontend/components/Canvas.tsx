import React, { useEffect, useState } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { setBoardData } from "../src/api/task";
import { useParams } from "react-router-dom";

const Canvas = ({ initialData }: { initialData: string }) => {
  const prams = useParams();
  const taskId = prams.taskid;
  const [whiteBoard, setWhiteBoard] = useState<
    readonly ExcalidrawElement[] | null
  >([]);

  useEffect(() => {
    const saveData = async () => {
      const finalElements = whiteBoard?.filter((element: ExcalidrawElement) => {
        return element.isDeleted == false;
      });
      await setBoardData(taskId, finalElements);
    };
    saveData();
  }, [whiteBoard, taskId]);

  return (
    <>
      <div style={{ height: "93vh", position: "relative" }}>
        {initialData ? (
          <Excalidraw
            theme="dark"
            initialData={{
              elements: initialData && JSON.parse(initialData),
            }}
            UIOptions={{
              canvasActions: {
                export: false,
                loadScene: false,
                saveAsImage: false,
              },
            }}
            onChange={(excaliDrawElements) => {
              setWhiteBoard(excaliDrawElements);
            }}
          >
            <MainMenu>
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
        ) : (
          <Excalidraw
            theme="dark"
            UIOptions={{
              canvasActions: {
                export: false,
                loadScene: false,
                saveAsImage: false,
              },
            }}
            onChange={(excaliDrawElements) => {
              setWhiteBoard(excaliDrawElements);
            }}
          >
            <MainMenu>
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
        )}
      </div>
    </>
  );
};

export default Canvas;
