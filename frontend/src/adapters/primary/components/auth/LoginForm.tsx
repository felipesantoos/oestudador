import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuthStore } from '../../../state/authStore';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess,
  onForgotPassword
}) => {
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>();
  
  const onSubmit = async (data: LoginFormValues) => {
    const success = await login(data.email, data.password);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          fullWidth
          error={errors.email?.message}
          {...register('email', { 
            required: 'Email is required'
          })}
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            error={errors.password?.message}
            {...register('password', { 
              required: 'Password is required'
            })}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
          onClick={onForgotPassword}
        >
          Forgot your password?
        </button>
      </div>
      
      <Button 
        type="submit" 
        fullWidth
        isLoading={isLoading}
      >
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;