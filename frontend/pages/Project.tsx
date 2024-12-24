import React from "react";
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
  const project = useProjectStore((state) => state);

  const [tasks, setTasks] = React.useState<TaskInterface[]>([]);
  React.useEffect(()=>{
    const getData = async () => {
      if (!project.currentProject?.id) return;
      const data = await getTasks(project.currentProject.id);
      toast.success("Tasks Fetched Successfully");
      setTasks(data);
    }
    getData();
  },[project.currentProject?.id])

  const tabs = [
    {
      id: "list",
      label: "List",
      content: <Tasks project={project} tasks={tasks} setTasks={setTasks} />,
    },
    {
      id: "kanban",
      label: "Kanban Board",
      content: <KanbanBoard setTasks={setTasks} tasks={tasks} />,
    },
    {
      id: "pomodoro",
      label: "Pomodoro Timer",
      content: <PomodoroTimer />,
    },
  ];
  
  return (
    <Layout>
      <Tabs selectedKey={project.selectedTab} onSelectionChange={project.setSelectedTab} aria-label="Dynamic tabs" items={tabs}>
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
