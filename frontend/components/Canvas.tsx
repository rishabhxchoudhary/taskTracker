import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { setBoardData } from "../src/api/task";
import { useParams } from "react-router-dom";
import debounce from "lodash/debounce";
import useDeepCompareEffect from "use-deep-compare-effect";
import { toast } from "sonner";
import { Button, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import React from "react";
import {DateValue, parseAbsoluteToLocal} from "@internationalized/date";
import { getAccessLink } from "../src/api/public_links";
import { useProjectStore } from "../store/projectStore";


const CopyIcon = () => {
  return (
    <svg
      fill="none"
      height={20}
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width={20}
    >
      <path d="M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z" />
    </svg>
  );
};

const Canvas = ({ initialData }: { initialData: string }) => {
  const params = useParams(); // Fixed typo from 'prams' to 'params'
  const taskId = params.taskid;
  const [whiteBoard, setWhiteBoard] = React.useState<
    readonly ExcalidrawElement[] | null
  >([]);

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const project = useProjectStore((state) => state.currentProject);
  const saveData = React.useCallback(async () => {
    if (!taskId) return;
    const finalElements = whiteBoard?.filter((element: ExcalidrawElement) => !element.isDeleted);
    if (!finalElements) return;
    try {
      await setBoardData(taskId, finalElements);
      toast.success("Board saved successfully.");
    } catch (error) {
      console.error("Error saving board data:", error);
    }
  }, [taskId, whiteBoard]);

  const debouncedSaveData = React.useCallback(debounce(saveData, 1000), [saveData]);


  useDeepCompareEffect(() => {
    debouncedSaveData();
    return () => {
      debouncedSaveData.cancel();
    };
  }, [debouncedSaveData, whiteBoard]); 

  const [expirationDate, setExpirationDate] = React.useState<DateValue | null>(
    parseAbsoluteToLocal((new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toISOString()),
  );
  const [publicLink, setPublicLink] = React.useState<string | null>(null);

  const handleGenerateLink = React.useCallback(
    async (access: 'view' | 'edit') => {
      if (!taskId) {
        toast.error("Task ID is missing.");
        return;
      }
      if (!project) return;
      if (!expirationDate) return;
      try {
        const date: Date = expirationDate.toDate("IST");
        const response = await getAccessLink(taskId, project.id, access, Math.floor(date.getTime() / 1000));
        console.log("response", response);
        const base_url = window.location.origin;
        const link = `${base_url}/${response.id}`;
        setPublicLink(link);
        toast.success("Link generated successfully.");
      } catch (error) {
        console.error("Error generating link:", error);
        toast.error("Failed to generate link.");
      }
    },
    [taskId, expirationDate, project],
  );

  return (
    <div id="whiteboard" style={{ height: "93vh", position: "relative" }}>
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
            saveAsImage: true,
          },
        }}
        onChange={(excaliDrawElements) => {
          setWhiteBoard(excaliDrawElements);
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.Help />
          <MainMenu.ItemCustom>
            <Button size="sm" onPress={onOpen}>
              Get Public View Link
            </Button>
          </MainMenu.ItemCustom>
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
        <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint />
          <WelcomeScreen.Hints.ToolbarHint />
          <WelcomeScreen.Hints.HelpHint />
        </WelcomeScreen>
      </Excalidraw>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Generate Public View Link</ModalHeader>
              <ModalBody>
                {publicLink ? <> 
                <Input endContent={<Button onPress={()=>{
                  navigator.clipboard.writeText(publicLink);
                  toast.success("Link copied to clipboard");
                }} className="bg-transparent" size="sm" isIconOnly><CopyIcon /></Button> } readOnly value={publicLink} variant="bordered"/>
                </> : <>
                  <DatePicker
                    showMonthAndYearPickers
                    className="max-w-md"
                    label="Expiration Date & Time"
                    value={expirationDate}
                    variant="bordered"
                    onChange={setExpirationDate}
                    minValue={parseAbsoluteToLocal(new Date(Date.now()+1*24*60*60* 1000).toISOString())}
                    />
                </>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {publicLink ? <Button color="primary" onPress={()=>{setPublicLink(null)}}>Reset</Button> : <Button color="success" variant="light" onPress={()=>{handleGenerateLink("edit")}}>Generate</Button>}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Canvas;
