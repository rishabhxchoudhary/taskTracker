// TaskCard.jsx
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  DateInput,
} from "@nextui-org/react";
import React from "react";
import { TaskInterface } from "../types/types";

const TaskCard = ({
  title,
  description,
  deadlineDate,
  priority,
}: TaskInterface) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "primary";
      case "medium":
        return "secondary";
      case "high":
        return "warning";
      case "urgent":
        return "danger";
    }
  };
  return (
    <Card style={{ width: "100%", cursor: "pointer", padding: "10px" }}>
      <CardHeader>
        <h2 className="text-lg font-semibold">{title}</h2>
      </CardHeader>
      <CardBody>
        {description.length > 200
          ? description.slice(0, 200) + "..."
          : description}
      </CardBody>
      
      <CardFooter>
        {deadlineDate && (
          <DateInput
            variant="bordered"
            label="Deadline Date"
            size="sm"
            isReadOnly
            defaultValue={deadlineDate}
          />
        )}
      </CardFooter>
      <CardFooter>
        <Chip color={getPriorityColor(priority)}>{String(priority)}</Chip>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
