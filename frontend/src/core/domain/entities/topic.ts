export interface Topic {
  id: string;
  disciplineId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TopicRelation {
  id: string;
  topicId: string;
  relatedTopicId: string;
  relationType: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanTopicResource {
  id: string;
  planId: string;
  topicId: string;
  resourceTypeId: string;
  title: string;
  description?: string;
  url?: string;
  content?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledReview {
  id: string;
  planId: string;
  topicId: string;
  scheduledDate: string;
  completed: boolean;
  ignored: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}