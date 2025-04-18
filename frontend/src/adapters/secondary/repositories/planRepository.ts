import { Plan, PlanWithRelations } from '../../../core/domain/entities/plan';
import { PlanRepository } from '../../../core/ports/repositories';
import { httpClient } from '../api/httpClient';

export class ApiPlanRepository implements PlanRepository {
  async findAll(): Promise<Plan[]> {
    return httpClient.get<Plan[]>('/plans');
  }

  async findById(id: string): Promise<Plan | null> {
    try {
      return await httpClient.get<Plan>(`/plans/${id}`);
    } catch (error) {
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Plan[]> {
    return httpClient.get<Plan[]>(`/plans?userId=${userId}`);
  }

  async findWithRelations(id: string): Promise<PlanWithRelations | null> {
    try {
      return await httpClient.get<PlanWithRelations>(`/plans/${id}?_expand=objective&_expand=planStatus&_embed=disciplines&_embed=topics`);
    } catch (error) {
      return null;
    }
  }

  async create(data: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan> {
    return httpClient.post<Plan>('/plans', data);
  }

  async update(id: string, data: Partial<Plan>): Promise<Plan> {
    return httpClient.patch<Plan>(`/plans/${id}`, data);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await httpClient.delete(`/plans/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }
}