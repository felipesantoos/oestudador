export interface AuthService {
  login(email: string, password: string): Promise<import('../domain/entities/user').AuthUser | null>;
  logout(): Promise<void>;
  register(userData: Omit<import('../domain/entities/user').User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>): Promise<import('../domain/entities/user').User>;
  getCurrentUser(): Promise<import('../domain/entities/user').User | null>;
  resetPassword(email: string): Promise<boolean>;
  updatePassword(token: string, newPassword: string): Promise<boolean>;
}

export interface StudyPlanService {
  createPlan(planData: Omit<import('../domain/entities/plan').Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<import('../domain/entities/plan').Plan>;
  updatePlan(id: string, planData: Partial<import('../domain/entities/plan').Plan>): Promise<import('../domain/entities/plan').Plan>;
  addDisciplineToPlan(planId: string, disciplineId: string, data: Omit<import('../domain/entities/plan').PlanDiscipline, 'planId' | 'disciplineId'>): Promise<import('../domain/entities/plan').PlanDiscipline>;
  addTopicToPlan(planId: string, topicId: string): Promise<import('../domain/entities/plan').PlanTopic>;
  markTopicAsCompleted(planId: string, topicId: string, completed: boolean): Promise<import('../domain/entities/plan').PlanTopic>;
}

export interface StudyService {
  recordStudySession(studyData: Omit<import('../domain/entities/study').StudyRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<import('../domain/entities/study').StudyRecord>;
  getStudyProgress(planId: string, startDate: string, endDate: string): Promise<any>;
  setStudyGoal(goalData: Omit<import('../domain/entities/study').StudyGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<import('../domain/entities/study').StudyGoal>;
}

export interface ResourceService {
  addResource(resourceData: Omit<import('../domain/entities/topic').PlanTopicResource, 'id' | 'createdAt' | 'updatedAt'>): Promise<import('../domain/entities/topic').PlanTopicResource>;
  updateResource(id: string, resourceData: Partial<import('../domain/entities/topic').PlanTopicResource>): Promise<import('../domain/entities/topic').PlanTopicResource>;
  scheduleReview(planId: string, topicId: string, date: string): Promise<import('../domain/entities/topic').ScheduledReview>;
}

export interface FlashcardService {
  createNoteType(noteTypeData: Omit<import('../domain/entities/note').NoteType, 'id' | 'createdAt' | 'updatedAt'>): Promise<import('../domain/entities/note').NoteType>;
  createNote(noteData: Omit<import('../domain/entities/note').Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<import('../domain/entities/note').Note>;
  getCardsForReview(userId: string, limit?: number): Promise<import('../domain/entities/note').CardInstance[]>;
  recordReview(reviewData: Omit<import('../domain/entities/note').CardReview, 'id' | 'reviewedAt'>): Promise<import('../domain/entities/note').CardReview>;
}