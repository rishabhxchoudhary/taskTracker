import React, { useCallback } from "react";
import {
  Button,
  Chip,
  DateInput,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Radio,
  RadioGroup,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import {
  createTask,
  deleteTask,
  updateStatus,
} from "../src/api/task";
import { toast } from "sonner";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { PlusIcon } from "./PlusIcon";
import { DeleteIcon } from "./DeleteIcon";
import { TaskInterface } from "../types/types";
import { EditIcon } from "./EditIcon";

const INITIAL_VISIBLE_COLUMNS = [
  "title",
  "deadline_date",
  "priority",
  "status",
  "action",
];

const columns = [
  { name: "Title", uid: "title", sortable: true },
  { name: "Deadline Date", uid: "deadline_date", sortable: true },
  { name: "Priority", uid: "priority", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Created At", uid: "created_at", sortable: true },
  { name: "Actions", uid: "action" },
];

const statusOptions = [
  { name: "To Do", uid: "to_do" },
  { name: "In Progress", uid: "in_progress" },
  { name: "Done", uid: "done" },
];

const Tasks = ({ tasks, project, setTasks }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");
  const [taskDeadlineDate, setTaskDeadlineDate] =
    React.useState<CalendarDate | null>(null);
  const [taskPriority, setTaskPriority] = React.useState<
    "low" | "medium" | "high" | "urgent"
  >("low");
  const [loading, setLoading] = React.useState(false);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteClose,
  } = useDisclosure();
  const [taskToDelete, setTaskToDelete] = React.useState<TaskInterface | null>(
    null
  );
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const [taskToEdit, setTaskToEdit] = React.useState<TaskInterface | null>(
    null
  );

  const addTask = async () => {
    if (!project) return;
    setLoading(true);
    let taskDeadlineDate2 = 0;
    if (taskDeadlineDate) {
      const utcDate = Date.UTC(
        taskDeadlineDate.year,
        taskDeadlineDate.month - 1,
        taskDeadlineDate.day
      );
      taskDeadlineDate2 = Math.floor(utcDate / 1000);
    }
    const task = await createTask(
      taskTitle,
      taskDescription,
      project.id,
      taskPriority,
      taskDeadlineDate2
    );
    setTasks((prev) => [
      ...prev,
      task,
    ]);
    toast.success("Task Created Successfully");
    onOpen();
    setLoading(false);
    setTaskTitle("");
    setTaskDescription("");
    setTaskDeadlineDate(null);
    setTaskPriority("low");
  };

  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "priority",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredTasks = [...tasks];

    if (hasSearchFilter) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredTasks = filteredTasks.filter((task) =>
        Array.from(statusFilter).includes(task.status)
      );
    }

    return filteredTasks;
  }, [tasks, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const updateTaskStatus = useCallback(
    async (taskId, projectId, status) => {
      setLoading(true);
      await updateStatus(taskId, projectId, status);
      setTasks((prev) => {
        return prev.map((task) => {
          if (task.id === taskId) {
            return { ...task, status };
          }
          return task;
        });
      });
      setTaskToEdit((prev) => {
        if (!prev) return null;
        return { ...prev, status };
      })
      setLoading(false);
    },
    [setTasks]
  );

  const renderCell = React.useCallback(
    (task, columnKey) => {
      const cellValue = task[columnKey];

      switch (columnKey) {
        case "deadline_date":
          if (cellValue) {
            return new Date(cellValue * 1000).toLocaleDateString();
          } else {
            return "No Deadline";
          }
        case "priority":
          return (
            <Chip
              color={
                cellValue == "low"
                  ? "success"
                  : cellValue == "medium"
                  ? "primary"
                  : cellValue == "high"
                  ? "warning"
                  : "danger"
              }
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "created_at":
          return new Date(cellValue * 1000).toLocaleDateString();
        case "status":
          return (
            <Chip
              color={
                cellValue == "to_do"
                  ? "danger"
                  : cellValue == "in_progress"
                  ? "warning"
                  : "success"
              }
              size="sm"
              variant="flat"
            >
              {cellValue
                ? cellValue == "to_do"
                  ? "To Do"
                  : cellValue == "in_progress"
                  ? "In Progress"
                  : "Done"
                : "To Do"}
            </Chip>
          );
        case "title":
          return <div>{cellValue}</div>;
        case "action":
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit Task">
                <Button
                  onPress={() => {
                    setTaskToEdit(task);
                    onEditOpen();
                  }}
                  isIconOnly
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <EditIcon />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Delete Task">
                <Button
                  isIconOnly
                  onPress={() => {
                    setTaskToDelete(task);
                    onDeleteOpen();
                  }}
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                >
                  <DeleteIcon />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onDeleteOpen, onEditOpen]
  );

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  }

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const classNames = React.useMemo(
    () => ({
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        "group-data-[middle=true]/tr:before:rounded-none",
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
    }),
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by title..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button onPress={onOpen} color="success" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {tasks.length} tasks
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    onClear,
    onOpen,
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    onSearchChange,
    tasks.length,
  ]);
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onNextPage, onPreviousPage]);

  const handlerTaskDelete = async () => {
    if (!taskToDelete) return;
    if (!project) return;
    setLoading(true);
    await deleteTask(taskToDelete.id, project.id);
    setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id));
    toast.success("Task Deleted Successfully");
    setLoading(false);
    onDeleteClose();
  };

  return (
    <>
      <div className="mt-2">
        <Table
          selectionMode="single"
          isHeaderSticky
          aria-label="Tasks Table"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={classNames}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={"start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No Task found"} items={sortedItems}>
            {(item) => (
              <TableRow
                className="cursor-pointer"
                onClick={() => {
                  navigate(`/project/${item.id}`);
                }}
                key={item.id}
              >
                {(columnKey) => (
                  <>
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  </>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                <Button color="danger" isDisabled={loading} onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onPress={addTask}
                  isLoading={loading}
                  isDisabled={
                    taskTitle.trim() === "" ||
                    loading
                  }
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteClose} closeButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete Task</ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete the task{" "}
                  <strong>{taskToDelete?.title}</strong>? This action cannot be
                  undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isDisabled={loading}
                  isLoading={loading}
                  onPress={handlerTaskDelete}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} closeButton>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Edit Task</ModalHeader>
              <ModalBody>
                <Input
                  label="Task Title"
                  placeholder="Enter Task Title"
                  value={taskToEdit?.title}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required={true}
                  isRequired={true}
                  isReadOnly
                />
                <Input
                  label="Task Description"
                  placeholder="Enter Task Description"
                  value={taskToEdit?.description}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required={true}
                  isRequired={true}
                  isReadOnly
                />
                <Divider />
                <RadioGroup
                  color="success"
                  size="sm"
                  isReadOnly
                  value={taskToEdit?.priority}
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
                  isReadOnly
                  minValue={today(getLocalTimeZone())}
                />
                <Divider />

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      // radius="full"
                      color={
                        taskToEdit.status == "to_do"
                          ? "danger"
                          : taskToEdit.status == "in_progress"
                          ? "warning"
                          : "success"
                      }
                      size="lg"
                      variant="shadow"
                    >
                      {taskToEdit.status
                        ? taskToEdit.status == "to_do"
                          ? "To Do"
                          : taskToEdit.status == "in_progress"
                          ? "In Progress"
                          : "Done"
                        : "To Do"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      color="danger"
                      className="text-danger"
                      onPress={() => {
                        updateTaskStatus(taskToEdit.id, project.id, "to_do");
                      }}
                      key="to_do"
                    >
                      To Do
                    </DropdownItem>
                    <DropdownItem
                      color="warning"
                      className="text-warning"
                      onPress={() => {
                        updateTaskStatus(
                          taskToEdit.id,
                          project.id,
                          "in_progress"
                        );
                      }}
                      key="in_progress"
                    >
                      In Progress
                    </DropdownItem>
                    <DropdownItem
                      onPress={() => {
                        updateTaskStatus(taskToEdit.id, project.id, "done");
                      }}
                      color="success"
                      className="text-success"
                      key="done"
                    >
                      Done
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Tasks;
