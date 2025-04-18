import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { StudyRecord } from '../../../../core/domain/entities/study';
import { StudyCategory } from '../../../../core/domain/entities/study';

interface StudySessionFormProps {
  planId: string;
  topicId: string;
  studyCategories: StudyCategory[];
  onSubmit: (data: Omit<StudyRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const StudySessionForm: React.FC<StudySessionFormProps> = ({ 
  planId,
  topicId,
  studyCategories,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm<Partial<StudyRecord>>();
  
  const selectedCategoryId = watch('studyCategoryId');
  const selectedCategory = studyCategories.find(c => c.id === selectedCategoryId);
  
  const handleFormSubmit = (data: Partial<StudyRecord>) => {
    // Calculate total minutes
    const totalMinutes = (hours * 60) + minutes;
    const totalTime = `PT${hours}H${minutes}M`;
    
    onSubmit({
      planId,
      topicId,
      studyCategoryId: data.studyCategoryId!,
      studyTime: totalTime,
      material: data.material,
      completed: !!data.completed,
      scheduleReviews: !!data.scheduleReviews,
      questionsRight: data.questionsRight,
      questionsWrong: data.questionsWrong,
      startPage: data.startPage,
      endPage: data.endPage,
      videoName: data.videoName,
      videoStartTime: data.videoStartTime,
      videoEndTime: data.videoEndTime,
      comment: data.comment,
      studiedAt: new Date().toISOString(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Study Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Study Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register('studyCategoryId', { 
                  required: 'Study category is required'
                })}
              >
                <option value="">Select a category</option>
                {studyCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.studyCategoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.studyCategoryId.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>
              
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minutes
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                />
              </div>
            </div>
            
            <Input
              label="Study Material"
              placeholder="What did you study?"
              fullWidth
              {...register('material')}
            />
            
            {/* Conditional fields based on category */}
            {selectedCategory?.name?.toLowerCase().includes('reading') && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Page"
                  type="number"
                  {...register('startPage', { valueAsNumber: true })}
                />
                <Input
                  label="End Page"
                  type="number"
                  {...register('endPage', { valueAsNumber: true })}
                />
              </div>
            )}
            
            {selectedCategory?.name?.toLowerCase().includes('video') && (
              <>
                <Input
                  label="Video Name"
                  fullWidth
                  {...register('videoName')}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Time"
                    type="time"
                    {...register('videoStartTime')}
                  />
                  <Input
                    label="End Time"
                    type="time"
                    {...register('videoEndTime')}
                  />
                </div>
              </>
            )}
            
            {selectedCategory?.name?.toLowerCase().includes('question') && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Correct Answers"
                  type="number"
                  {...register('questionsRight', { valueAsNumber: true })}
                />
                <Input
                  label="Wrong Answers"
                  type="number"
                  {...register('questionsWrong', { valueAsNumber: true })}
                />
              </div>
            )}
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Any notes about this study session..."
                {...register('comment')}
              ></textarea>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="completed"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...register('completed')}
              />
              <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                Mark as completed
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="scheduleReviews"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...register('scheduleReviews')}
              />
              <label htmlFor="scheduleReviews" className="text-sm font-medium text-gray-700">
                Schedule spaced repetition reviews
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
              Save Study Session
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudySessionForm;