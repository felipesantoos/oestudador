import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Bookmark, Calendar, Clock, Plus, Target, TrendingUp, BookOpen, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import PlanCard from '../components/plans/PlanCard';
import { useAuthStore } from '../../state/authStore';
import { usePlanStore } from '../../state/planStore';
import { Plan } from '../../../core/domain/entities/plan';

// This would be a real chart component in a production app
const DummyChart = () => (
  <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
    <p className="text-gray-500">Study Progress Chart</p>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { plans, fetchUserPlans, isLoading } = usePlanStore();
  
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        await fetchUserPlans(user.id);
      }
    };
    
    loadData();
  }, [user?.id, fetchUserPlans]);
  
  // Get the 3 most recent plans
  const recentPlans = Array.isArray(plans) ? plans.slice(0, 3) : [];
  
  // Mock data for dashboard metrics
  const metrics = {
    weeklyStudyTime: '18h 24m',
    completedTopics: 32,
    todayGoal: '2h 30m',
    upcomingReviews: 12
  };
  
  // Mock upcoming schedule data
  const upcomingSchedule = [
    { id: '1', title: 'Physics - Mechanics Review', time: '10:00 AM', duration: '1h 30m' },
    { id: '2', title: 'Mathematics - Linear Algebra Practice', time: '2:00 PM', duration: '2h' },
    { id: '3', title: 'Chemistry - Organic Chemistry Notes', time: '4:30 PM', duration: '1h' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'}
        </h1>
        <Link to="/plans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Study Plan
          </Button>
        </Link>
      </div>
      
      {/* Dashboard metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Weekly Study Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.weeklyStudyTime}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" /> 12% from last week
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Topics</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.completedTopics}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" /> 8 topics this week
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Goal</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.todayGoal}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <Target className="h-4 w-4 mr-1" /> 45% completed
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-md">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming Reviews</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.upcomingReviews}</p>
                <p className="text-sm text-blue-600 mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> 4 due today
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-md">
                <Bookmark className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Study Progress</CardTitle>
                <div className="flex items-center">
                  <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DummyChart />
            </CardContent>
          </Card>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Study Plans</h2>
              <Link to="/plans" className="text-sm text-blue-600 hover:text-blue-500">
                View all plans
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded mt-4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recentPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPlans.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    objective={{ name: 'Biology Exam' }} // Mock data
                    planStatus={{ name: 'In Progress' }} // Mock data
                    topicsCount={20} // Mock data
                    completedTopicsCount={8} // Mock data
                    onClick={() => {/* Navigate to plan */}}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No study plans yet</h3>
                  <p className="text-gray-500 mb-4">Create your first study plan to start tracking your progress</p>
                  <Link to="/plans/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Study Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingSchedule.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {upcomingSchedule.map(item => (
                    <div key={item.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{item.time}</span>
                            <span className="mx-2">•</span>
                            <span>{item.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No scheduled sessions for today</p>
                </div>
              )}
            </CardContent>
            <div className="px-6 py-4 border-t border-gray-200">
              <Button variant="outline" fullWidth>
                <Plus className="mr-2 h-4 w-4" />
                Add Study Session
              </Button>
            </div>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Study Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Study Efficiency</span>
                    <span className="font-medium">76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Focus Rating</span>
                    <span className="font-medium">82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Weekly Goal Completion</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/analytics">
                  <Button variant="outline" fullWidth className="flex items-center justify-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;