import React from "react";
import Layout from "../layouts/Layout";
import {
  Button,
  DateInput,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { RadioGroup, Radio } from "@nextui-org/react";
import { TaskInterface } from "../types/types";
import TaskCard from "../components/TaskCard";
import AddTaskCard from "../components/AddTask";

const Project = () => {
  const [tasks, setTasks] = React.useState<TaskInterface[]>([
    {
      id: 1,
      title: "Sample Title 1",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      deadlineDate: null,
      priority: "low",
      status: 0,
    },
    {
      id: 2,
      title: "Sample Title 2",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      deadlineDate: null,
      priority: "high",
      status: 0,
    },
    {
      id: 3,
      title: "Sample Title 2",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      deadlineDate: null,
      priority: "high",
      status: 0,
    },
    {
      id: 4,
      title: "Sample Title 2",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      deadlineDate: null,
      priority: "high",
      status: 0,
    },
    {
      id: 5,
      title: "Sample Title 2",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      deadlineDate: null,
      priority: "high",
      status: 0,
    },
  ]);
  const addTask = () => {
    const newTask: TaskInterface = {
      id: tasks.length + 1,
      title: taskTitle,
      description: taskDescription,
      deadlineDate: taskDeadlineDate,
      priority: taskPriority,
      status: 0,
    };
    console.log("new task", newTask);
    setTasks([...tasks, newTask]);

    onOpen();
    setTaskTitle("");
    setTaskDescription("");
    setTaskDeadlineDate(null);
    setTaskPriority("low");
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");
  const [taskDeadlineDate, setTaskDeadlineDate] =
    React.useState<CalendarDate | null>(null);
  const [taskPriority, setTaskPriority] = React.useState<
    "low" | "medium" | "high" | "urgent"
  >("low");
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid gap-4 grid-cols-6" style={{
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))"
        }}>
          <AddTaskCard onAdd={onOpen} />
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              deadlineDate={task.deadlineDate}
              priority={task.priority}
              status={task.status}
            />
          ))}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} closeButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Task</ModalHeader>
              <ModalBody>
                <Input
                  label="Task Title"
                  placeholder="Enter Task Title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required={true}
                  isRequired={true}
                />
                <Input
                  label="Task Description"
                  placeholder="Enter Task Description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required={true}
                  isRequired={true}
                />
                <Divider />
                <RadioGroup
                  color="success"
                  size="sm"
                  value={taskPriority}
                  onValueChange={(value: string) => {
                    const validPriorities = ["low", "medium", "high", "urgent"] as const;
                    if (validPriorities.includes(value as typeof validPriorities[number])) {
                      setTaskPriority(value as "low" | "medium" | "high" | "urgent");
                    } else {
                      console.warn(`Invalid priority value: ${value}`);
                    }
                  }}
                  label="Set the priority of this task"
                  orientation="horizontal"
                >
                  <Radio value="urgent">Urgent</Radio>
                  <Radio value="high">High</Radio>
                  <Radio value="medium">Medium</Radio>
                  <Radio value="low">Low</Radio>
                </RadioGroup>
                <Divider />
                <DateInput
                  size="sm"
                  value={taskDeadlineDate}
                  onChange={(e) => setTaskDeadlineDate(e)}
                  label="Deadline Date"
                  minValue={today(getLocalTimeZone())}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onPress={addTask}
                  isDisabled={
                    taskTitle.trim() === "" || taskDescription.trim() === ""
                  }
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default Project;
