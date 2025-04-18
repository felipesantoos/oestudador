import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuthStore } from '../../../state/authStore';
import { Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register: registerUser, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormValues>();
  
  const onSubmit = async (data: RegisterFormValues) => {
    const { confirmPassword, ...userData } = data;
    
    const success = await registerUser({
      ...userData,
      avatarUrl: undefined,
      birthDate: undefined,
      notificationsEnabled: true
    });
    
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Name"
          fullWidth
          error={errors.name?.message}
          {...register('name', { 
            required: 'Name is required'
          })}
        />
        
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
        
        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', { 
            required: 'Please confirm your password'
          })}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('language', { 
              required: 'Language is required'
            })}
          >
            <option value="">Select a language</option>
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
            <option value="es">Spanish</option>
          </select>
          {errors.language && (
            <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('timezone', { 
              required: 'Timezone is required'
            })}
          >
            <option value="">Select a timezone</option>
            <option value="America/Sao_Paulo">America/Sao Paulo (UTC-3)</option>
            <option value="America/New_York">America/New York (UTC-4)</option>
            <option value="Europe/London">Europe/London (UTC+1)</option>
            <option value="Europe/Paris">Europe/Paris (UTC+2)</option>
          </select>
          {errors.timezone && (
            <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Button 
        type="submit" 
        fullWidth
        isLoading={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;