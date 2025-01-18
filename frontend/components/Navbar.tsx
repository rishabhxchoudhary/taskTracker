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
  CircularProgress,
  cn,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
import { useAuthStore } from "../store/authStore";
import { useProjectStore } from "../store/projectStore";
import React from "react";
import { createProject, deleteProject, getProjects } from "../src/api/project";
import { MdDelete } from "react-icons/md";
import { Alert } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import useTimerStore from "../store/timerStore";
import { getModeColor } from "../utils/utils";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../src/api/auth";
import { toast } from "sonner";
import axios from "axios";
import { Project } from "../types/types";
import { useTour } from "@reactour/tour";

const googlecallback = async (token) => {
  const googleRes = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        personFileds: "emailAddresses,names,photos",
      },
    }
  );
  return googleRes.data;
};

const alertSound = new Howl({
  src: ["/sounds/alarm.mp3"],
  volume: 0.5,
});
function convertTimestampToCalendarDate(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return new CalendarDate(year, month, day);
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export function NavbarComponent() {
  const { setIsOpen } = useTour();
  const {
    timeLeft,
    isRunning,
    maxTime,
    mode,
    setMode,
    incrementCycle,
    cycle,
  } = useTimerStore();

  const loginClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const callbackdata = await googlecallback(tokenResponse.access_token);
      const data = await googleLogin({
        email: callbackdata.email,
        name: callbackdata.name,
        avatar: callbackdata.picture,
      });
      auth?.login(data);
      navigate("/project");
      toast.success("Logged In Successfully");
    },
  });
  const worker = useTimerStore((state) => state.worker);

  React.useEffect(() => {
    if (isRunning) {
      const modeText =
        mode === "work"
          ? "Work"
          : mode === "shortBreak"
          ? "Short Break"
          : "Long Break";

      document.title = `${formatTime(timeLeft)} - ${modeText} | Task Tracker`;
    } else {
      document.title = "Task Tracker";
    }
  }, [timeLeft, mode, isRunning]);

  
 React.useEffect(() => {
    // Handle when the timer finishes
    const handleFinished = () => {
        alertSound.play();

      if (Notification.permission === 'granted') {
        new Notification(
          `Time for ${mode === 'work' ? 'a break!' : 'work!'}`
        );
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
    };
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'finished') {
        handleFinished();
      }
    };

    worker.addEventListener('message', handleMessage);

    return () => {
      worker.removeEventListener('message', handleMessage);
    };
  }, [mode, cycle, setMode, incrementCycle, worker]);

  const navigate = useNavigate();
  const auth = useAuthStore((state) => state);
  const projectStore = useProjectStore((state) => state);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteClose,
  } = useDisclosure();
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(
    null
  );

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateClose,
  } = useDisclosure();
  const [newProjectName, setNewProjectName] = React.useState<string>("");
  const [newProjectDesc, setNewProjectDescription] = React.useState<string>("");

  React.useEffect(() => {
    const getUserProjects = async () => {
      const projects1: Project[] = await getProjects();
      setProjects(projects1);
      // Optionally set the first project as current if none is selected
      if (!projectStore.currentProject && projects1.length > 0) {
        projectStore.setCurrentProject(projects1[0]);
      }
    };
    getUserProjects();
    setMode('work');
  }, []);

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
    if (newProjectName.trim() !== "") {
      setLoading(true);
      await createProject(newProjectName, newProjectDesc);
      setProjects(await getProjects());
      setNewProjectDescription("");
      setNewProjectName("");
      onCreateClose();
      setLoading(false);
    }
  };
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <Navbar
        classNames={{
          base: cn("border-default-100", {}),
          wrapper: "w-full justify-center",
          item: "hidden md:flex",
        }}
        height="60px"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand>
          <span className="ml-2 text-small font-medium cursor-pointer">
            <a
              onClick={() => {
                if (auth.user) {
                  navigate("/project");
                  projectStore.setSelectedTab("list");
                } else {
                  navigate("/");
                }
              }}
            >
              Task Tracker
            </a>
          </span>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex" justify="end">
          {auth && auth.user && auth?.user?.created_at && (
            <>
              <NavbarItem id="projects">
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
                          description={
                            project.description?.length > 50
                              ? project.description?.slice(0, 50) + "..."
                              : project.description
                          }
                          onPress={() =>
                            projectStore.setCurrentProject(project)
                          }
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
                        key="create-new"
                        startContent={<RiStickyNoteAddLine />}
                        title="Create New Project"
                        onPress={() => onCreateOpen()}
                      />
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
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
            </>
          )}
          <NavbarItem>
            <Link color="success" href="https://forms.gle/obmjKxBUyYGCe9Xd7">
              Feedback Link
            </Link>
          </NavbarItem>
          {isRunning && (
            <NavbarItem>
              <CircularProgress
                color={getModeColor(mode)}
                aria-label="Timer Progress"
                classNames={{
                  svg: "drop-shadow-md",
                  track: `stroke-white/10`,
                  value: `text-${getModeColor(
                    mode
                  )} font-semibold drop-shadow-md`,
                }}
                showValueLabel={true}
                strokeWidth={1}
                value={(timeLeft / maxTime) * 100}
                valueLabel={formatTime(timeLeft)}
              />
            </NavbarItem>
          )}
          {auth && auth.user ? (
            <>
              <NavbarItem>
                <Button onPress={() => setIsOpen(true)}>Open Tour</Button>
              </NavbarItem>
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform"
                      color="default"
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
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Button
                  as={Link}
                  color="primary"
                  onPress={() => {
                    loginClick();
                  }}
                  variant="flat"
                >
                  Log in with Google
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        <NavbarMenuToggle className="text-default-400 md:hidden" />

        <NavbarMenu className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit  pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150">
          {auth && auth.user && auth?.user?.created_at && (
            <>
              <NavbarMenuItem id="projects">
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
                          description={
                            project.description?.length > 50
                              ? project.description?.slice(0, 50) + "..."
                              : project.description
                          }
                          onPress={() =>
                            projectStore.setCurrentProject(project)
                          }
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
                        key="create-new"
                        startContent={<RiStickyNoteAddLine />}
                        title="Create New Project"
                        onPress={() => onCreateOpen()}
                      />
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </NavbarMenuItem>
              <NavbarMenuItem>
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
              </NavbarMenuItem>
            </>
          )}
          <NavbarMenuItem>
            <Link color="success" href="https://forms.gle/obmjKxBUyYGCe9Xd7">
              Feedback Link
            </Link>
          </NavbarMenuItem>
          {isRunning && (
            <NavbarMenuItem>
              <CircularProgress
                color={getModeColor(mode)}
                aria-label="Timer Progress"
                classNames={{
                  svg: "drop-shadow-md",
                  track: `stroke-white/10`,
                  value: `text-${getModeColor(
                    mode
                  )} font-semibold drop-shadow-md`,
                }}
                showValueLabel={true}
                strokeWidth={1}
                value={(timeLeft / maxTime) * 100}
                valueLabel={formatTime(timeLeft)}
              />
            </NavbarMenuItem>
          )}
          {auth && auth.user ? (
            <>
              <NavbarMenuItem>
                <Button
                  onPress={() => {
                    setIsMenuOpen(false);
                    setIsOpen(true);
                  }}
                >
                  Open Tour
                </Button>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform"
                      color="default"
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
              </NavbarMenuItem>
            </>
          ) : (
            <>
              <NavbarMenuItem>
                <Button
                  as={Link}
                  color="primary"
                  onPress={() => {
                    loginClick();
                  }}
                  variant="flat"
                >
                  Log in with Google
                </Button>
              </NavbarMenuItem>
            </>
          )}
        </NavbarMenu>
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
                <Button
                  isLoading={loading}
                  color="danger"
                  onPress={handleDeleteProject}
                >
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
                  isDisabled={newProjectName.trim() === ""}
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
