export interface Objective {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanStatus {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamStyle {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  institution?: string;
  year?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}