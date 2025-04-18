import { Plan, PlanWithRelations } from '../../../core/domain/entities/plan';
import { apiClient } from '../../../lib/axios';

export class PlanRepository {
  async getAll(): Promise<Plan[]> {
    return apiClient.get<Plan[]>('/plans');
  }

  async getById(id: string): Promise<Plan> {
    return await apiClient.get<Plan>(`/plans/${id}`);
  }

  async getByUserId(userId: string): Promise<Plan[]> {
    return apiClient.get<Plan[]>(`/plans?userId=${userId}`);
  }

  async getByIdWithRelations(id: string): Promise<PlanWithRelations> {
    return await apiClient.get<PlanWithRelations>(`/plans/${id}?_expand=objective&_expand=planStatus&_embed=disciplines&_embed=topics`);
  }

  async create(data: Partial<Plan>): Promise<Plan> {
    return apiClient.post<Plan>('/plans', data);
  }

  async update(id: string, data: Partial<Plan>): Promise<Plan> {
    return apiClient.patch<Plan>(`/plans/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/plans/${id}`);
  }
}