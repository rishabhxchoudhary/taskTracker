import React, { useEffect, useState } from "react";
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { getBoardData, setBoardData } from "../src/api/task";
import { useParams } from "react-router-dom";
import { Skeleton } from "@nextui-org/react";
import { toast } from "sonner";
const Canvas = () => {
  const prams = useParams();
  const taskId = prams.taskid;
  const [whiteBoard, setWhiteBoard] = useState<
    readonly ExcalidrawElement[] | null
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getBoardData(taskId);
      setWhiteBoard(data);
      toast.success("WhiteBoard Loaded");
    };
    fetchData();
  }, [taskId]);

  useEffect(() => {
    const saveData = async () => {
      const finalElements = whiteBoard.filter((element: ExcalidrawElement) => {
        return element.isDeleted == false;
      });
      await setBoardData(taskId, finalElements);
    };
    saveData();
  }, [whiteBoard, taskId]);
  if (!whiteBoard) return;
  <Skeleton
    style={{
      height: "93vh",
      width: "100%",
    }}
  />;

  return (
    <>
      <div style={{ height: "93vh", position: "relative" }}>
        <Excalidraw
          theme="dark"
          onChange={(elements: readonly ExcalidrawElement[]) => {
            setWhiteBoard(elements);
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
    </>
  );
};

export default Canvas;
