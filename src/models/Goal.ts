export interface GoalView {
  title: string;
  description: string;
  isCompleted: string;
}

export interface Goal extends GoalView {
  id: number;
}
