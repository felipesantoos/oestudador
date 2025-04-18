import { StudyPlanService } from '../ports/services';
import { PlanRepository, DisciplineRepository, TopicRepository } from '../ports/repositories';
import { Plan, PlanDiscipline, PlanTopic, PlanWithRelations } from '../domain/entities/plan';
import { Discipline } from '../domain/entities/discipline';
import { Topic } from '../domain/entities/topic';

export class PlanManagementUseCase {
  constructor(
    private studyPlanService: StudyPlanService,
    private planRepository: PlanRepository,
    private disciplineRepository: DisciplineRepository,
    private topicRepository: TopicRepository
  ) {}

  async createPlan(planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan> {
    return this.studyPlanService.createPlan(planData);
  }

  async getUserPlans(userId: string): Promise<Plan[]> {
    return this.planRepository.findByUserId(userId);
  }

  async getPlanDetails(planId: string): Promise<PlanWithRelations | null> {
    return this.planRepository.findWithRelations(planId);
  }

  async updatePlan(planId: string, planData: Partial<Plan>): Promise<Plan> {
    return this.studyPlanService.updatePlan(planId, planData);
  }

  async getAllDisciplines(): Promise<Discipline[]> {
    return this.disciplineRepository.findAll();
  }

  async getTopicsByDiscipline(disciplineId: string): Promise<Topic[]> {
    return this.topicRepository.findByDisciplineId(disciplineId);
  }

  async addDisciplineToPlan(
    planId: string, 
    disciplineId: string, 
    data: Omit<PlanDiscipline, 'planId' | 'disciplineId'>
  ): Promise<PlanDiscipline> {
    return this.studyPlanService.addDisciplineToPlan(planId, disciplineId, data);
  }

  async addTopicToPlan(planId: string, topicId: string): Promise<PlanTopic> {
    return this.studyPlanService.addTopicToPlan(planId, topicId);
  }

  async markTopicAsCompleted(planId: string, topicId: string, completed: boolean): Promise<PlanTopic> {
    return this.studyPlanService.markTopicAsCompleted(planId, topicId, completed);
  }
}