import React, { useEffect } from "react";
import Layout from "../layouts/Layout";
import { TaskInterface } from "../types/types";
import { getTasks } from "../src/api/task";
import { useProjectStore } from "../store/projectStore";
import { toast } from "sonner";
import Tasks from "../components/Tasks";
import {Tabs, Tab } from "@nextui-org/react";
import KanbanBoard from "../components/kanbanboard/KanbanBoard";
import PomodoroTimer from "../components/PomodoroTimer";

const Project = () => {
  const project = useProjectStore((state) => state.currentProject);
  const [tasks, setTasks] = React.useState<TaskInterface[]>([]);
  useEffect(()=>{
    const getData = async () => {
      if (!project?.id) return;
      const data = await getTasks(project.id);
      toast.success("Tasks Fetched Successfully");
      setTasks(data);
    }
    getData();
  },[project?.id])

  const tabs = [
    {
      id: "list",
      label: "List",
      content: <Tasks project={project} tasks={tasks} setTasks={setTasks} />,
    },
    {
      id: "kanban",
      label: "Kanban Board",
      content: <KanbanBoard tasks={tasks} />,
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
