// AddTaskCard.jsx
import { Card, CardBody } from "@nextui-org/react";
// import React from "react";
import { FaPlus } from "react-icons/fa";

const AddTaskCard = ({ onAdd }) => (
  <Card style={{ width: "100%" }} onPress={onAdd}>
    <CardBody className="flex items-center justify-center" onClick={onAdd}>
      <FaPlus  />
    </CardBody>
  </Card>
);

export default AddTaskCard;
