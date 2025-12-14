export interface Task {
  id: string;
  title: string;
  description: string;
  isOptional: boolean;
  isCompleted: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  isMainQuest: boolean;
  tasks: Task[];
  questLineId: string;
  isCompleted: boolean;
}

export interface QuestLine {
  id: string;
  title: string;
  description: string;
}
