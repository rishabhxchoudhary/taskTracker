import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Avatar,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  DropdownSection,
} from "@nextui-org/react";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { useAuthStore } from "../store/authStore";
import { useProjectStore } from "../store/projectStore";
import { useEffect, useRef, useState } from "react";
import { createProject, deleteProject, getProjects } from "../src/api/project";
import { Project } from "../types/types";
import { MdDelete } from "react-icons/md";
import { Alert } from "@nextui-org/react";
// import React from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from 'howler';
import useTimerStore from "../store/timerStore";

const alertSound = new Howl({
  src: ['../../assets/sounds/alarm.mp3'],
  volume: 0.5, 
});
function convertTimestampToCalendarDate(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return new CalendarDate(year, month, day);
}

export function NavbarComponent() {
  const { timeLeft, isRunning, decrementTime, mode, setMode, incrementCycle, cycle, pauseTimer } = useTimerStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
      if (isRunning && timeLeft > 0) {
        timerRef.current = setInterval(() => {
          decrementTime();
        }, 1000);
      } else if (timeLeft === 0) {
        alertSound.play();
        pauseTimer()
        if (Notification.permission === 'granted') {
          new Notification(`Time for ${mode === 'work' ? 'a break!' : 'work!'}`);
        }
        if (mode === 'work') {
          if ((cycle + 1) % 2 === 0) {
            setMode('longBreak');
          } else {
            setMode('shortBreak');
          }
        } else {
          setMode('work');
          if (mode === 'shortBreak') {
            incrementCycle();
          }
        }
      }
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [isRunning, timeLeft, mode, decrementTime, setMode, incrementCycle, cycle, pauseTimer]);

  const navigate = useNavigate();
  const auth = useAuthStore((state) => state);
  const projectStore = useProjectStore((state) => state);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteClose,
  } = useDisclosure();
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateClose,
  } = useDisclosure();
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDesc, setNewProjectDescription] = useState<string>("");

  useEffect(() => {
    const getUserProjects = async () => {
      const projects1: Project[] = await getProjects();
      setProjects(projects1);
      // Optionally set the first project as current if none is selected
      if (!projectStore.currentProject && projects1.length > 0) {
        projectStore.setCurrentProject(projects1[0]);
      }
    };
    getUserProjects();
  }, [projectStore]);

  const handleDeleteProject = async () => {
    if (projectToDelete) {
      setLoading(true);
      await deleteProject(projectToDelete.id);
      const leftProjects = await getProjects();
      setProjects(leftProjects);
      if (projectToDelete.id === projectStore.currentProject?.id) {
        projectStore.setCurrentProject(leftProjects[0]);
      }
      setProjectToDelete(null);
      setLoading(false);
      onDeleteClose();
    }
  };

  const handleCreateProject = async () => {
    if (newProjectName.trim() !== "" ) {
      setLoading(true);
      await createProject(newProjectName, newProjectDesc);
      setProjects(await getProjects());
      setNewProjectDescription("");
      setNewProjectName("");
      onCreateClose();
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-2xl cursor-pointer"> <a onClick={()=>{navigate("/")}}>Task Tracker</a> </p>
        </NavbarBrand>

        <NavbarContent justify="end" className="flex items-center space-x-4">
          {auth && auth.user && auth?.user?.created_at && (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" color="success">
                  {projectStore.currentProject
                    ? projectStore.currentProject.name
                    : ""}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownSection showDivider={true} aria-label="projects">
                  {projects.map((project: Project) => (
                    <DropdownItem
                      // className=""
                      key={project.id}
                      title={project.name}
                      description={project.description?.length > 50 ? project.description?.slice(0, 50) + "..." : project.description}
                      onPress={() => projectStore.setCurrentProject(project)}
                      endContent={
                        <Button
                          isIconOnly
                          color="danger"
                          variant="flat"
                          onPress={() => {
                            setProjectToDelete(project);
                            onDeleteOpen();
                          }}
                        >
                          <MdDelete className="w-4 h-4 " />
                        </Button>
                      }
                    />
                  ))}
                </DropdownSection>

                <DropdownSection aria-label="create-new-project">
                  <DropdownItem
                    // className=""
                    key="create-new"
                    startContent={<RiStickyNoteAddLine />}
                    title="Create New Project"
                    onPress={() => onCreateOpen()}
                  />
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
          {auth && auth.user && auth?.user?.created_at && (
            <NavbarItem>
              <DatePicker
                defaultValue={today(getLocalTimeZone())}
                minValue={convertTimestampToCalendarDate(
                  projectStore?.currentProject?.created_at || 0
                )}
                maxValue={today(getLocalTimeZone())}
                aria-label="Select a date"
                onChange={(date) => {
                  if (date) {
                    projectStore.setCurrentDate(date as CalendarDate);
                  }
                }}
              />
            </NavbarItem>
          )}
          <NavbarItem>
            {auth && auth.user ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={auth?.user?.username}
                    size="sm"
                    src={auth?.user?.avatar}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2 ">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{auth?.user?.username}</p>
                    <p className="">{auth?.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="logout">
                    <Button
                      variant="shadow"
                      color="danger"
                      onPress={auth?.logout}
                    >
                      Log Out
                    </Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button as={Link} color="primary" href="/login" variant="flat">
                Log In
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteClose} closeButton>
        <ModalContent>
          {(onClose) => (
            <>
              {projects.length == 1 && (
                <Alert
                  color="warning"
                  title={`You have only 1 project. If you delete this, a new Sample Project will be created`}
                />
              )}
              <ModalHeader className="">Delete Project</ModalHeader>
              <ModalBody className="">
                <p>
                  Are you sure you want to delete the project{" "}
                  <strong>{projectToDelete?.name}</strong>? This action cannot
                  be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Cancel
                </Button>
                <Button isLoading={loading} color="danger" onPress={handleDeleteProject}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isCreateOpen} onOpenChange={onCreateClose} closeButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="">Create New Project</ModalHeader>
              <ModalBody>
                <Input
                  label="Project Name"
                  placeholder="Enter project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  isRequired={true}
                />
                <Input
                  label="Project Description"
                  placeholder="Enter project Description"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onPress={handleCreateProject}
                  isLoading={loading}
                  isDisabled={
                    newProjectName.trim() === ""
                  }
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
