import { StudyService, ResourceService } from '../ports/services';
import { StudyRecordRepository } from '../ports/repositories';
import { StudyRecord, StudyGoal } from '../domain/entities/study';
import { PlanTopicResource, ScheduledReview } from '../domain/entities/topic';

export class StudyTrackingUseCase {
  constructor(
    private studyService: StudyService,
    private resourceService: ResourceService,
    private studyRecordRepository: StudyRecordRepository
  ) {}

  async recordStudySession(studyData: Omit<StudyRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudyRecord> {
    return this.studyService.recordStudySession(studyData);
  }

  async getStudyRecordsByPlan(planId: string): Promise<StudyRecord[]> {
    return this.studyRecordRepository.findByPlanId(planId);
  }

  async getStudyRecordsByTopic(topicId: string): Promise<StudyRecord[]> {
    return this.studyRecordRepository.findByTopicId(topicId);
  }

  async getStudyProgress(planId: string, startDate: string, endDate: string): Promise<any> {
    return this.studyService.getStudyProgress(planId, startDate, endDate);
  }

  async setStudyGoal(goalData: Omit<StudyGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudyGoal> {
    return this.studyService.setStudyGoal(goalData);
  }

  async addResource(resourceData: Omit<PlanTopicResource, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlanTopicResource> {
    return this.resourceService.addResource(resourceData);
  }

  async scheduleReview(planId: string, topicId: string, date: string): Promise<ScheduledReview> {
    return this.resourceService.scheduleReview(planId, topicId, date);
  }
}