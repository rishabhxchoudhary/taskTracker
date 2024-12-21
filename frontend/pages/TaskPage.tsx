import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import Canvas from "../components/Canvas";
import { useParams } from "react-router-dom";
import { getBoardData } from "../src/api/task";
import { toast } from "sonner";
import { Skeleton } from "@nextui-org/react";
const TaskPage = () => {
  const prams = useParams();
  const taskId = prams.taskid;
  const [initialData, setInitialData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getBoardData(taskId);
      setInitialData(data);
      setLoading(false);
      toast.success("WhiteBoard Loaded");
    };
    fetchData();
  }, [taskId]);

  if (loading) {
    return <Layout>
      <Skeleton style={{height: "93vh", width: "100%"}} />
    </Layout>;
  }
  
  return (
    <Layout>
      <Canvas initialData={initialData} />
    </Layout>
  );
};

export default TaskPage;
