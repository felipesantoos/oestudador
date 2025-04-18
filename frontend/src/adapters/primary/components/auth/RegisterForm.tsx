import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useAuth } from '../../../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
  birthDate: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const timezones = [
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (GMT-3)' },
  { value: 'America/New_York', label: 'America/New_York (GMT-4)' },
  { value: 'Europe/London', label: 'Europe/London (GMT+1)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (GMT+2)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (GMT+10)' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
];

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const { confirmPassword, ...userData } = data;
      await registerUser({
        ...userData,
        notificationsEnabled: true
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          fullWidth
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          fullWidth
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div>
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            fullWidth
            {...register('password')}
            error={errors.password?.message}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div>
        <div className="relative">
          <Input
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            fullWidth
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div>
        <Select
          label="Timezone"
          fullWidth
          options={timezones}
          {...register('timezone')}
          error={errors.timezone?.message}
        />
      </div>

      <div>
        <Select
          label="Language"
          fullWidth
          options={languages}
          {...register('language')}
          error={errors.language?.message}
        />
      </div>

      <div>
        <Input
          label="Birth Date (optional)"
          type="date"
          fullWidth
          {...register('birthDate')}
          error={errors.birthDate?.message}
        />
      </div>

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};

export default RegisterForm;