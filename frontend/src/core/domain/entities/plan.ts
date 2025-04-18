export interface Plan {
  id: string;
  userId: string;
  objectiveId: string;
  planStatusId: string;
  name: string;
  imageUrl?: string;
  notes?: string;
  startDate?: string;
  endDate?: string;
  weeklyHours?: number;
  reviewEnabled: boolean;
  reviewIntervals?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanWithRelations extends Plan {
  objective?: Objective;
  planStatus?: PlanStatus;
  disciplines?: PlanDiscipline[];
  topics?: PlanTopic[];
  exams?: Exam[];
}

export interface PlanDiscipline {
  planId: string;
  disciplineId: string;
  percentage?: number;
  weeklyHours?: number;
  color?: string;
  discipline?: Discipline;
}

export interface PlanTopic {
  planId: string;
  topicId: string;
  completed: boolean;
  topic?: Topic;
  resources?: PlanTopicResource[];
}

export interface PlanProjection {
  id: string;
  userId: string;
  planId: string;
  projectedCompletion?: string;
  confidence?: number;
}