import React from "react";
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
import { createTask, getTasks } from "../src/api/task";
import { toast } from "sonner";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { PlusIcon } from "./PlusIcon";
import { DeleteIcon } from "./DeleteIcon";
// import TaskTable from "./TaskTable";

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
  { name: "Action", uid: "action" },
];

const statusOptions = [
  { name: "To Do", uid: "todo" },
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

  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
      new Set(INITIAL_VISIBLE_COLUMNS),
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
          if (cellValue === "low") {
            return <Chip color="primary">Low</Chip>;
          } else if (cellValue === "medium") {
            return <Chip color="secondary">Medium</Chip>;
          } else if (cellValue === "high") {
            return <Chip color="warning">High</Chip>;
          } else {
            return <Chip color="danger">Urgent</Chip>;
          }
        case "created_at":
          return new Date(cellValue * 1000).toLocaleDateString();
        case "status":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button radius="full" size="sm" variant="ghost">
                  {cellValue
                    ? cellValue == "to_do"
                      ? "To Do"
                      : cellValue == "in_progress"
                      ? "In Progress"
                      : "Done"
                    : "To Do"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onPress={() => {
                    task.status = "to_do";
                  }}
                  key="to_do"
                >
                  To Do
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    task.status = "in_progress";
                  }}
                  key="in_progress"
                >
                  In Progress
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    task.status = "done";
                  }}
                  key="done"
                >
                  Done
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        case "title":
          return (
            <div
              className="cursor-pointer"
              onClick={() => {
                navigate(`/project/${task.id}`);
              }}
            >
              {" "}
              {cellValue}
            </div>
          );
        case "action":
          case "actions":
        return (
            <Tooltip color="danger" content="Delete Task">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
        )
        default:
          return cellValue;
      }
    },
    [navigate]
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
      [],
    );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">

            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {tasks.length} tasks</span>
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
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    onSearchChange,
    tasks.length
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

  return (
    <>
      <div className="mt-2">
        <Table
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
          <TableBody emptyContent={"No Tasks found"} items={sortedItems}>
            {(item) => (
              <TableRow key={item.id}>
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
    </>
  );
};

export default Tasks;
