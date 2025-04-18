import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePlan } from '../../../contexts/PlanContext';
import { Calendar, BookOpen, Clock, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { plans } = usePlan();

  const upcomingPlans = plans
    .filter(plan => new Date(plan.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  const recentPlans = plans
    .filter(plan => new Date(plan.endDate) < new Date())
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-sm text-gray-600">
            Here's an overview of your study progress and upcoming plans.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Plans
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {plans.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/plans"
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  View all plans
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Plans
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {plans.filter(plan => 
                          new Date(plan.startDate) <= new Date() && 
                          new Date(plan.endDate) >= new Date()
                        ).length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/plans?status=active"
                  className="font-medium text-green-700 hover:text-green-900"
                >
                  View active plans
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Upcoming Plans
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {plans.filter(plan => new Date(plan.startDate) > new Date()).length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/plans?status=upcoming"
                  className="font-medium text-yellow-700 hover:text-yellow-900"
                >
                  View upcoming plans
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Plans
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {plans.filter(plan => new Date(plan.endDate) < new Date()).length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/plans?status=completed"
                  className="font-medium text-purple-700 hover:text-purple-900"
                >
                  View completed plans
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Study Plans</h3>
              <div className="mt-4 flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {upcomingPlans.length > 0 ? (
                    upcomingPlans.map((plan) => (
                      <li key={plan.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {plan.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              Starts {new Date(plan.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <Link
                              to={`/plans/${plan.id}`}
                              className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4">
                      <p className="text-sm text-gray-500">No upcoming plans</p>
                    </li>
                  )}
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  to="/plans/new"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Create new plan
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Study Plans</h3>
              <div className="mt-4 flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentPlans.length > 0 ? (
                    recentPlans.map((plan) => (
                      <li key={plan.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {plan.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              Completed {new Date(plan.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <Link
                              to={`/plans/${plan.id}`}
                              className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4">
                      <p className="text-sm text-gray-500">No recent plans</p>
                    </li>
                  )}
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  to="/plans"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View all plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;