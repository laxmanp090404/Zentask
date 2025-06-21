export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export interface User {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: User;
  assignedTo?: User;
  priority: Priority;
  dueDate: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  boardId: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: User;
}