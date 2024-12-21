import React, { useEffect } from "react";
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
import { createTask, getTasks } from "../src/api/task";
import { useProjectStore } from "../store/projectStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function getPriorityIndex(priority: string) {
  switch (priority) {
    case "low":
      return 5;
    case "medium":
      return 4;
    case "high":
      return 3;
    case "urgent":
      return 2;
    default:
      return 1000;
  }
}


const Project = () => {
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.currentProject);
  const [tasks, setTasks] = React.useState<TaskInterface[]>([]);
  useEffect(()=>{
    const getData = async () => {
      if (!project?.id) return;
      const data = await getTasks(project.id);
      data.sort((a, b) => {
        return getPriorityIndex(a.priority) - getPriorityIndex(b.priority);
      });
      toast.success("Tasks Fetched Successfully");
      setTasks(data);
    }
    getData();
  },[project?.id])

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const addTask = async () => {
    if (!project) return;
    let taskDeadlineDate2 = 0;
    if (taskDeadlineDate) {
      const utcDate = Date.UTC(
        taskDeadlineDate.year,
        taskDeadlineDate.month - 1,
        taskDeadlineDate.day
      );
      taskDeadlineDate2 = Math.floor(utcDate / 1000);
    }
    await createTask(
      taskTitle,
      taskDescription,
      project.id,
      taskPriority,
      taskDeadlineDate2
    );
    const data = await getTasks(project.id);
    toast.success("Task Created Successfully");
    // Sort them by priority, priority low, medium, high, urgent
    data.sort((a, b) => {
      return getPriorityIndex(a.priority) - getPriorityIndex(b.priority);
    });
    setTasks(data);
    onOpen();
    setTaskTitle("");
    setTaskDescription("");
    setTaskDeadlineDate(null);
    setTaskPriority("low");
  };
  
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
        Project Id: {project?.id}
        Project Name: {project?.name} 
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          }}
        >
          {tasks.map((task) => (
            <div key={task.id} onClick={() => navigate(`/task/${task.id}`)}>
            <TaskCard
              id={task.id}
              title={task.title}
              description={task.description}
              deadlineDate={task.deadlineDate}
              priority={task.priority}
            />
            </div>
          ))}
          <AddTaskCard onAdd={onOpen} />
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
                    const validPriorities = [
                      "low",
                      "medium",
                      "high",
                      "urgent",
                    ] as const;
                    if (
                      validPriorities.includes(
                        value as (typeof validPriorities)[number]
                      )
                    ) {
                      setTaskPriority(
                        value as "low" | "medium" | "high" | "urgent"
                      );
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
