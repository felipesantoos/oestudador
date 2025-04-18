import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuthStore } from '../../state/authStore';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { updatePassword, isLoading, error } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors } 
  } = useForm<ResetPasswordFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    
    const success = await updatePassword(token, data.password);
    if (success) {
      setIsSubmitted(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BookOpen className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Password updated successfully
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  You can now log in with your new password. Redirecting to login page...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="New password"
                  type="password"
                  fullWidth
                  error={errors.password?.message}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                    }
                  })}
                />
                
                <Input
                  label="Confirm new password"
                  type="password"
                  fullWidth
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => 
                      value === password || 'The passwords do not match'
                  })}
                />
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    type="submit" 
                    fullWidth
                    isLoading={isLoading}
                  >
                    Reset password
                  </Button>
                  
                  <Link 
                    to="/login"
                    className="inline-flex items-center justify-center text-sm text-gray-600 hover:text-gray-500"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;