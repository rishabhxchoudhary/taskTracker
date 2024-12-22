import React, { useEffect } from "react";
import Layout from "../layouts/Layout";
import { TaskInterface } from "../types/types";
import { getTasks } from "../src/api/task";
import { useProjectStore } from "../store/projectStore";
import { toast } from "sonner";
import Tasks from "../components/Tasks";
import {Tabs, Tab } from "@nextui-org/react";
import KanbanBoard from "../components/KanbanBoard";
import PomodoroTimer from "../components/PomodoroTimer";

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

  const tabs = [
    {
      id: "tasks",
      label: "Tasks",
      content: <Tasks project={project} tasks={tasks} setTasks={setTasks} />,
    },
    {
      id: "kanban",
      label: "Kanban Board",
      content: <KanbanBoard />,
    },
    {
      id: "pomodoro",
      label: "Pomodoro Timer",
      content: <PomodoroTimer />,
    },
  ];
  
  return (
    <Layout>
      <Tabs aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        )}
      </Tabs>
    </Layout>
  );
};

export default Project;
