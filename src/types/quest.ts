export interface Subtask {
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
  isOptional: boolean;
  subtasks: Subtask[];
  questLineId: string;
  isCompleted: boolean;
  deadline: string | null;
}

export interface QuestLine {
  id: string;
  title: string;
  description: string;
}
