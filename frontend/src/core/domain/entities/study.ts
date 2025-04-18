export interface StudyRecord {
  id: string;
  planId: string;
  topicId: string;
  studyCategoryId: string;
  studyTime?: string;
  material?: string;
  completed: boolean;
  scheduleReviews: boolean;
  questionsRight?: number;
  questionsWrong?: number;
  startPage?: number;
  endPage?: number;
  videoName?: string;
  videoStartTime?: string;
  videoEndTime?: string;
  comment?: string;
  studiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyGoal {
  id: string;
  userId: string;
  planId: string;
  goalTypeId: string;
  periodId: string;
  target?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyGoalType {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface StudyPeriod {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}