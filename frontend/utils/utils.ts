export function getPriorityIndex(priority: string) {
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

export function getModeColor(mode: "work" | "shortBreak" | "longBreak") {
  if (mode=="work") {
    return "danger"
  } else if (mode=="shortBreak") {
    return "warning"
  } else if (mode=="longBreak") {
    return "success"
  }
}