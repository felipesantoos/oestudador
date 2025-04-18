import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Plan, PlanWithRelations } from '../core/domain/entities/plan';
import { UserRepository } from '../adapters/secondary/repositories/userRepository';
import { PlanRepository } from '../adapters/secondary/repositories/planRepository';

interface PlanContextType {
  plans: Plan[];
  currentPlan: PlanWithRelations | null;
  isLoading: boolean;
  error: string | null;
  fetchUserPlans: (userId: string) => Promise<void>;
  fetchPlanDetails: (planId: string) => Promise<void>;
  createPlan: (data: Partial<Plan>) => Promise<boolean>;
  updatePlan: (planId: string, data: Partial<Plan>) => Promise<boolean>;
  deletePlan: (planId: string) => Promise<boolean>;
}

const PlanContext = createContext<PlanContextType | null>(null);

// Create instances of repositories
const userRepository = new UserRepository();
const planRepository = new PlanRepository();

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PlanWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPlans = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const userPlans = await planRepository.getByUserId(userId);
      setPlans(userPlans);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch plans');
      setIsLoading(false);
    }
  }, []);

  const fetchPlanDetails = useCallback(async (planId: string) => {
    setIsLoading(true);
    try {
      const plan = await planRepository.getByIdWithRelations(planId);
      setCurrentPlan(plan);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch plan details');
      setIsLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (data: Partial<Plan>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPlan = await planRepository.create(data);
      setPlans(prev => [...prev, newPlan]);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create plan');
      setIsLoading(false);
      return false;
    }
  }, []);

  const updatePlan = useCallback(async (planId: string, data: Partial<Plan>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPlan = await planRepository.update(planId, data);
      setPlans(prev => prev.map(plan => plan.id === planId ? updatedPlan : plan));
      if (currentPlan?.id === planId) {
        await fetchPlanDetails(planId);
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update plan');
      setIsLoading(false);
      return false;
    }
  }, [currentPlan?.id, fetchPlanDetails]);

  const deletePlan = useCallback(async (planId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await planRepository.delete(planId);
      setPlans(prev => prev.filter(plan => plan.id !== planId));
      if (currentPlan?.id === planId) {
        setCurrentPlan(null);
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete plan');
      setIsLoading(false);
      return false;
    }
  }, [currentPlan?.id]);

  const value = {
    plans,
    currentPlan,
    isLoading,
    error,
    fetchUserPlans,
    fetchPlanDetails,
    createPlan,
    updatePlan,
    deletePlan,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
} 