import type { CommunicationDecisionEntry, CommunicationEntryStatus } from "./communicationAssist";
import type { TaskItem } from "./moduleData";
import type { Project, RiskLevel } from "./types";

export type TaskCommandTone = "green" | "blue" | "orange" | "red";

export interface TaskCommandKpi {
  id: "today" | "attention" | "waiting" | "decision";
  label: string;
  value: string;
  detail: string;
  tone: TaskCommandTone;
}

export interface TaskTimelineBucket {
  id: TaskItem["status"];
  label: string;
  taskCount: number;
  highPriorityCount: number;
  waitingCount: number;
  completedCount: number;
  taskIds: string[];
}

export interface TaskProjectFocusRow {
  projectId: string;
  title: string;
  isbn: string;
  titleNumber: string;
  progress: number;
  risk: RiskLevel;
  taskCount: number;
  highPriorityCount: number;
  waitingCount: number;
  openCommunicationCount: number;
  pressureScore: number;
  leadingTaskTitle: string;
  tone: TaskCommandTone;
}

export interface TaskOwnerLoad {
  owner: string;
  taskCount: number;
  highPriorityCount: number;
  waitingCount: number;
  activeCount: number;
}

export interface TaskAttentionItem {
  taskId: string;
  title: string;
  project: string;
  due: string;
  reason: string;
  nextStep: string;
  linkedCommunicationStatus: CommunicationEntryStatus | "unbekannt";
  tone: TaskCommandTone;
}

export interface TaskCommandCenterModel {
  kpis: TaskCommandKpi[];
  timeline: TaskTimelineBucket[];
  projectFocus: TaskProjectFocusRow[];
  ownerLoad: TaskOwnerLoad[];
  attentionItems: TaskAttentionItem[];
}

const timelineOrder: Array<{ id: TaskItem["status"]; label: string }> = [
  { id: "Heute", label: "Heute" },
  { id: "Morgen", label: "Morgen" },
  { id: "Diese Woche", label: "Diese Woche" },
];

function isOpenCommunication(entry: CommunicationDecisionEntry | undefined) {
  return entry?.status === "offen" || entry?.status === "wartet";
}

function getRiskWeight(risk: RiskLevel) {
  if (risk === "hoch") {
    return 4;
  }

  if (risk === "mittel") {
    return 2;
  }

  return 0;
}

function getPressureTone(score: number): TaskCommandTone {
  if (score >= 10) {
    return "red";
  }

  if (score >= 6) {
    return "orange";
  }

  if (score >= 3) {
    return "blue";
  }

  return "green";
}

function getAttentionTone(task: TaskItem, communication: CommunicationDecisionEntry | undefined): TaskCommandTone {
  if (task.priority === "hoch" || (task.detailStatus === "wartet" && isOpenCommunication(communication))) {
    return "red";
  }

  if (task.detailStatus === "offen" || task.priority === "mittel") {
    return "orange";
  }

  return "blue";
}

export function getTaskCommandCenter(
  tasks: TaskItem[],
  projects: Project[],
  communicationEntries: CommunicationDecisionEntry[],
): TaskCommandCenterModel {
  const communicationById = new Map(communicationEntries.map((entry) => [entry.id, entry]));
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const todayCount = tasks.filter((task) => task.status === "Heute").length;
  const attentionCount = tasks.filter((task) => task.priority === "hoch" || task.detailStatus === "wartet").length;
  const waitingCount = tasks.filter((task) => task.detailStatus === "wartet").length;
  const decisionCount = tasks.filter((task) => isOpenCommunication(communicationById.get(task.relatedCommunicationId))).length;

  const timeline = timelineOrder.map<TaskTimelineBucket>((bucket) => {
    const bucketTasks = tasks.filter((task) => task.status === bucket.id);

    return {
      ...bucket,
      taskCount: bucketTasks.length,
      highPriorityCount: bucketTasks.filter((task) => task.priority === "hoch").length,
      waitingCount: bucketTasks.filter((task) => task.detailStatus === "wartet").length,
      completedCount: bucketTasks.filter((task) => task.detailStatus === "erledigt").length,
      taskIds: bucketTasks.map((task) => task.id),
    };
  });

  const projectFocus = projects
    .map<TaskProjectFocusRow | undefined>((project) => {
      const projectTasks = tasks.filter((task) => task.projectId === project.id);
      if (projectTasks.length === 0) {
        return undefined;
      }

      const highPriorityCount = projectTasks.filter((task) => task.priority === "hoch").length;
      const waitingTaskCount = projectTasks.filter((task) => task.detailStatus === "wartet").length;
      const openCommunicationCount = communicationEntries.filter(
        (entry) => entry.projectId === project.id && isOpenCommunication(entry),
      ).length;
      const pressureScore =
        projectTasks.length * 2 +
        highPriorityCount * 3 +
        waitingTaskCount * 2 +
        openCommunicationCount * 2 +
        getRiskWeight(project.risk);
      const leadTask =
        projectTasks.find((task) => task.priority === "hoch") ??
        projectTasks.find((task) => task.detailStatus === "wartet") ??
        projectTasks[0];

      return {
        projectId: project.id,
        title: project.title,
        isbn: project.isbn,
        titleNumber: project.titleNumber,
        progress: project.progress,
        risk: project.risk,
        taskCount: projectTasks.length,
        highPriorityCount,
        waitingCount: waitingTaskCount,
        openCommunicationCount,
        pressureScore,
        leadingTaskTitle: leadTask.title,
        tone: getPressureTone(pressureScore),
      };
    })
    .filter((row): row is TaskProjectFocusRow => Boolean(row))
    .sort((a, b) => b.pressureScore - a.pressureScore || a.title.localeCompare(b.title));

  const ownerLoad = [...new Set(tasks.map((task) => task.owner))]
    .map<TaskOwnerLoad>((owner) => {
      const ownerTasks = tasks.filter((task) => task.owner === owner);

      return {
        owner,
        taskCount: ownerTasks.length,
        highPriorityCount: ownerTasks.filter((task) => task.priority === "hoch").length,
        waitingCount: ownerTasks.filter((task) => task.detailStatus === "wartet").length,
        activeCount: ownerTasks.filter((task) => task.detailStatus === "in-arbeit").length,
      };
    })
    .sort((a, b) => b.highPriorityCount - a.highPriorityCount || b.taskCount - a.taskCount || a.owner.localeCompare(b.owner));

  const attentionItems = tasks
    .filter((task) => task.priority === "hoch" || task.detailStatus === "wartet" || task.detailStatus === "offen")
    .map<TaskAttentionItem>((task) => {
      const communication = communicationById.get(task.relatedCommunicationId);

      return {
        taskId: task.id,
        title: task.title,
        project: projectsById.get(task.projectId)?.title ?? task.project,
        due: task.due,
        reason: task.reason,
        nextStep: task.nextStep,
        linkedCommunicationStatus: communication?.status ?? "unbekannt",
        tone: getAttentionTone(task, communication),
      };
    })
    .sort((a, b) => {
      const toneOrder: Record<TaskCommandTone, number> = { red: 0, orange: 1, blue: 2, green: 3 };
      return toneOrder[a.tone] - toneOrder[b.tone] || a.due.localeCompare(b.due);
    });

  return {
    kpis: [
      {
        id: "today",
        label: "Heute fällig",
        value: todayCount.toString(),
        detail: `${timeline.find((bucket) => bucket.id === "Heute")?.highPriorityCount ?? 0} davon hoch priorisiert`,
        tone: todayCount > 2 ? "orange" : "blue",
      },
      {
        id: "attention",
        label: "Sofort prüfen",
        value: attentionCount.toString(),
        detail: "Hohe Priorität oder wartende Klärung",
        tone: attentionCount > 0 ? "red" : "green",
      },
      {
        id: "waiting",
        label: "Wartet extern",
        value: waitingCount.toString(),
        detail: "Abhängigkeit bei Redaktion, Autor oder Verlag",
        tone: waitingCount > 0 ? "orange" : "green",
      },
      {
        id: "decision",
        label: "Mit Mail verknüpft",
        value: decisionCount.toString(),
        detail: "Entscheidungsrelevante offene Kommunikation",
        tone: decisionCount > 0 ? "blue" : "green",
      },
    ],
    timeline,
    projectFocus,
    ownerLoad,
    attentionItems,
  };
}
