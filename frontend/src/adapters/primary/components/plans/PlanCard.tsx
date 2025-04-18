import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { BookOpen, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Plan } from '../../../../core/domain/entities/plan';

interface PlanCardProps {
  plan: Plan;
  objective?: { name: string };
  planStatus?: { name: string };
  topicsCount?: number;
  completedTopicsCount?: number;
  onClick?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  objective,
  planStatus,
  topicsCount = 0,
  completedTopicsCount = 0,
  onClick 
}) => {
  const getStatusVariant = (status?: string): 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'default';
      case 'completed':
        return 'success';
      case 'not started':
        return 'outline';
      case 'behind schedule':
        return 'warning';
      case 'abandoned':
        return 'danger';
      default:
        return 'default';
    }
  };

  const progressPercentage = topicsCount > 0 
    ? Math.round((completedTopicsCount / topicsCount) * 100) 
    : 0;

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="truncate">{plan.name}</CardTitle>
          {planStatus && (
            <Badge variant={getStatusVariant(planStatus.name)}>
              {planStatus.name}
            </Badge>
          )}
        </div>
        {objective && (
          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <BookOpen size={16} />
            <span>{objective.name}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {plan.startDate && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-1" />
                <span>Start: {new Date(plan.startDate).toLocaleDateString()}</span>
              </div>
            )}
            {plan.weeklyHours && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>{plan.weeklyHours} hrs/week</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={16} />
                Progress
              </span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;