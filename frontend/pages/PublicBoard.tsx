import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout"
import React from "react";
import { toast } from "sonner";
import { Skeleton } from "@nextui-org/react";
import PublicCanvas from "../components/PublicCanvas";
import { validatePublicLink } from "../src/api/public_links";

const PublicBoard = () => {
  const prams = useParams();
  console.log("params", prams)
  const boardId = prams.boardId;
  const [initialData, setInitialData] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await validatePublicLink(boardId);
      setInitialData(response);
      setLoading(false);
      toast.success("WhiteBoard Loaded");
    };
    fetchData();
  }, [boardId]);

  if (loading) {
    return <Skeleton style={{height: "93vh", width: "100%"}} />;
  }
  return (
    <Layout>
        <PublicCanvas access="view" initialData={initialData} />
    </Layout>
  )
}

export default PublicBoard