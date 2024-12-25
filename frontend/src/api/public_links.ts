import client from "./client";

export const getAccessLink = async (taskId: string,projectId: string, access: "view" | "edit", expiresAt: number): Promise<{ id: string }> => {
    const data = await client.post(`/task/generate_link`, {
        taskId,
        projectId,
        access,
        expiresAt
    });
    return data.data;
}