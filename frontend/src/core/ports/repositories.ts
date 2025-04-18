export interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export interface UserRepository extends Repository<import('../domain/entities/user').User> {
  findByEmail(email: string): Promise<import('../domain/entities/user').User | null>;
  authenticate(email: string, password: string): Promise<import('../domain/entities/user').AuthUser | null>;
}

export interface PlanRepository extends Repository<import('../domain/entities/plan').Plan> {
  findByUserId(userId: string): Promise<import('../domain/entities/plan').Plan[]>;
  findWithRelations(id: string): Promise<import('../domain/entities/plan').PlanWithRelations | null>;
}

export interface DisciplineRepository extends Repository<import('../domain/entities/discipline').Discipline> {
  findByPlanId(planId: string): Promise<import('../domain/entities/discipline').Discipline[]>;
}

export interface TopicRepository extends Repository<import('../domain/entities/topic').Topic> {
  findByDisciplineId(disciplineId: string): Promise<import('../domain/entities/topic').Topic[]>;
  findByPlanId(planId: string): Promise<import('../domain/entities/topic').Topic[]>;
}

export interface StudyRecordRepository extends Repository<import('../domain/entities/study').StudyRecord> {
  findByPlanId(planId: string): Promise<import('../domain/entities/study').StudyRecord[]>;
  findByTopicId(topicId: string): Promise<import('../domain/entities/study').StudyRecord[]>;
  findByDateRange(startDate: string, endDate: string): Promise<import('../domain/entities/study').StudyRecord[]>;
}

export interface NoteRepository extends Repository<import('../domain/entities/note').Note> {
  findByUserId(userId: string): Promise<import('../domain/entities/note').Note[]>;
  findCardInstances(noteId: string): Promise<import('../domain/entities/note').CardInstance[]>;
}