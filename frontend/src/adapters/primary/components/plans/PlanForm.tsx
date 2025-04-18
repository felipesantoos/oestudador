import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Plan } from '../../../../core/domain/entities/plan';
import { Objective } from '../../../../core/domain/entities/objective';

interface PlanFormProps {
  initialData?: Partial<Plan>;
  objectives?: Objective[];
  planStatuses?: { id: string; name: string }[];
  onSubmit: (data: Partial<Plan>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const PlanForm: React.FC<PlanFormProps> = ({ 
  initialData,
  objectives = [],
  planStatuses = [],
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<Partial<Plan>>({
    defaultValues: initialData || {}
  });
  
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.startDate) {
        setStartDate(initialData.startDate.split('T')[0]);
      }
      if (initialData.endDate) {
        setEndDate(initialData.endDate.split('T')[0]);
      }
    }
  }, [initialData, reset]);
  
  const handleFormSubmit = (data: Partial<Plan>) => {
    const formData = {
      ...data,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      weeklyHours: data.weeklyHours ? Number(data.weeklyHours) : undefined
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Plan Name"
          fullWidth
          error={errors.name?.message}
          {...register('name', { 
            required: 'Plan name is required'
          })}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objective
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('objectiveId', { 
                required: 'Objective is required'
              })}
            >
              <option value="">Select an objective</option>
              {objectives.map((objective) => (
                <option key={objective.id} value={objective.id}>
                  {objective.name}
                </option>
              ))}
            </select>
            {errors.objectiveId && (
              <p className="mt-1 text-sm text-red-600">{errors.objectiveId.message}</p>
            )}
          </div>
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('planStatusId', { 
                required: 'Status is required'
              })}
            >
              <option value="">Select a status</option>
              {planStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
            {errors.planStatusId && (
              <p className="mt-1 text-sm text-red-600">{errors.planStatusId.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <Input
            label="Weekly Hours"
            type="number"
            fullWidth
            {...register('weeklyHours', { 
              valueAsNumber: true,
              min: {
                value: 1,
                message: 'Must be at least 1'
              },
              max: {
                value: 168,
                message: 'Must be at most 168 (24*7)'
              }
            })}
            error={errors.weeklyHours?.message}
          />
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            {...register('notes')}
          ></textarea>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="reviewEnabled"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            {...register('reviewEnabled')}
          />
          <label htmlFor="reviewEnabled" className="text-sm font-medium text-gray-700">
            Enable spaced repetition reviews
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          isLoading={isLoading}
        >
          {initialData?.id ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
};

export default PlanForm;