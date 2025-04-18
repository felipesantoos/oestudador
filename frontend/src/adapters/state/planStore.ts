import { create } from 'zustand';
import { Plan, PlanWithRelations, PlanDiscipline, PlanTopic } from '../../core/domain/entities/plan';
import { Discipline } from '../../core/domain/entities/discipline';
import { Topic } from '../../core/domain/entities/topic';
import { ApiPlanRepository } from '../secondary/repositories/planRepository';
import { PlanManagementUseCase } from '../../core/usecases/planManagement';

// Repositories would be initialized in a real application
const planRepository = new ApiPlanRepository();
const disciplineRepository = {} as any; // Mock for this example
const topicRepository = {} as any; // Mock for this example
const studyPlanService = {} as any; // Mock for this example

// Initialize the use case
const planManagementUseCase = new PlanManagementUseCase(
  studyPlanService,
  planRepository,
  disciplineRepository,
  topicRepository
);

interface PlanState {
  plans: Plan[];
  currentPlan: PlanWithRelations | null;
  disciplines: Discipline[];
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
  
  fetchUserPlans: (userId: string) => Promise<void>;
  fetchPlanDetails: (planId: string) => Promise<void>;
  createPlan: (planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Plan>;
  updatePlan: (planId: string, planData: Partial<Plan>) => Promise<void>;
  addDisciplineToPlan: (planId: string, disciplineId: string, data: Omit<PlanDiscipline, 'planId' | 'disciplineId'>) => Promise<void>;
  addTopicToPlan: (planId: string, topicId: string) => Promise<void>;
  markTopicAsCompleted: (planId: string, topicId: string, completed: boolean) => Promise<void>;
  fetchAllDisciplines: () => Promise<void>;
  fetchTopicsByDiscipline: (disciplineId: string) => Promise<void>;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [], // Initialize as empty array
  currentPlan: null,
  disciplines: [],
  topics: [],
  isLoading: false,
  error: null,

  fetchUserPlans: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const plans = await planManagementUseCase.getUserPlans(userId);
      set({ plans: plans || [], isLoading: false }); // Ensure plans is always an array
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plans', 
        isLoading: false,
        plans: [] // Reset to empty array on error
      });
    }
  },

  fetchPlanDetails: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const plan = await planManagementUseCase.getPlanDetails(planId);
      set({ currentPlan: plan, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plan details', 
        isLoading: false 
      });
    }
  },

  createPlan: async (planData) => {
    set({ isLoading: true, error: null });
    try {
      const newPlan = await planManagementUseCase.createPlan(planData);
      set(state => ({ 
        plans: [...state.plans, newPlan],
        isLoading: false
      }));
      return newPlan;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create plan', 
        isLoading: false 
      });
      throw error;
    }
  },

  updatePlan: async (planId, planData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlan = await planManagementUseCase.updatePlan(planId, planData);
      set(state => ({ 
        plans: state.plans.map(p => p.id === planId ? updatedPlan : p),
        currentPlan: state.currentPlan?.id === planId ? 
          { ...state.currentPlan, ...updatedPlan } : 
          state.currentPlan,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update plan', 
        isLoading: false 
      });
    }
  },

  addDisciplineToPlan: async (planId, disciplineId, data) => {
    set({ isLoading: true, error: null });
    try {
      await planManagementUseCase.addDisciplineToPlan(planId, disciplineId, data);
      
      // Refetch plan details to update the state
      if (get().currentPlan?.id === planId) {
        await get().fetchPlanDetails(planId);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add discipline to plan', 
        isLoading: false 
      });
    }
  },

  addTopicToPlan: async (planId, topicId) => {
    set({ isLoading: true, error: null });
    try {
      await planManagementUseCase.addTopicToPlan(planId, topicId);
      
      // Refetch plan details to update the state
      if (get().currentPlan?.id === planId) {
        await get().fetchPlanDetails(planId);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add topic to plan', 
        isLoading: false 
      });
    }
  },

  markTopicAsCompleted: async (planId, topicId, completed) => {
    set({ isLoading: true, error: null });
    try {
      await planManagementUseCase.markTopicAsCompleted(planId, topicId, completed);
      
      // Update the local state
      set(state => {
        if (state.currentPlan?.id !== planId) return state;
        
        const updatedTopics = state.currentPlan.topics?.map(t => 
          t.topicId === topicId ? { ...t, completed } : t
        );
        
        return {
          currentPlan: {
            ...state.currentPlan,
            topics: updatedTopics
          },
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark topic as completed', 
        isLoading: false 
      });
    }
  },

  fetchAllDisciplines: async () => {
    set({ isLoading: true, error: null });
    try {
      const disciplines = await planManagementUseCase.getAllDisciplines();
      set({ disciplines: disciplines || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch disciplines', 
        isLoading: false,
        disciplines: []
      });
    }
  },

  fetchTopicsByDiscipline: async (disciplineId) => {
    set({ isLoading: true, error: null });
    try {
      const topics = await planManagementUseCase.getTopicsByDiscipline(disciplineId);
      set({ topics: topics || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch topics', 
        isLoading: false,
        topics: []
      });
    }
  }
}));