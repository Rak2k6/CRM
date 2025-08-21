import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SignupOTP() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  
  const [otpData, setOtpData] = useState({
    email: '',
    otp: ''
  });
  
  const [currentStep, setCurrentStep] = useState<'signup' | 'verify'>('signup');
  const [activeTab, setActiveTab] = useState('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Password strength indicators
  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const signupData = {
        ...formData,
        role: activeTab === 'admin' ? 'admin' : 'user'
      };

      const response = await fetch('/api/auth/signup-with-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setOtpData({ email: data.email, otp: '' });
      setCurrentStep('verify');
      toast({
        title: 'Verification Code Sent',
        description: `We've sent a 6-digit code to ${data.email}`,
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // Store authentication data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      toast({
        title: 'Account Created Successfully',
        description: 'Welcome to LDR Surveys CRM!',
      });

      // Redirect based on role
      if (data.user.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/');
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: otpData.email, purpose: 'signup' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast({
        title: 'Code Resent',
        description: 'A new verification code has been sent to your email',
      });
    } catch (error: any) {
      toast({
        title: 'Resend Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to <strong>{otpData.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpData.otp}
                  onChange={(e) => setOtpData({ ...otpData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                  required
                  data-testid="input-otp"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || otpData.otp.length !== 6}
                data-testid="button-verify-otp"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="p-0 h-auto"
                  data-testid="button-resend-otp"
                >
                  Resend Code
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setCurrentStep('signup')}
                  className="p-0 h-auto text-sm"
                  data-testid="button-back-signup"
                >
                  ← Back to Signup
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Choose your account type and create your LDR Surveys CRM account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center space-x-2" data-testid="tab-user">
                <User className="w-4 h-4" />
                <span>User</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center space-x-2" data-testid="tab-admin">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-4 mt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">User Account</h3>
                <p className="text-sm text-muted-foreground">
                  Access to dashboard, projects, and basic CRM features
                </p>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4 mt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Admin Account</h3>
                <p className="text-sm text-muted-foreground">
                  Full access to admin panel, user management, and all features
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSignup} className="space-y-4 mt-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-full rounded-full ${
                      passwordStrength.score < 2 ? 'bg-red-200' :
                      passwordStrength.score < 4 ? 'bg-yellow-200' : 'bg-green-200'
                    }`}>
                      <div className={`h-full rounded-full transition-all ${
                        passwordStrength.score < 2 ? 'bg-red-500 w-1/3' :
                        passwordStrength.score < 4 ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'
                      }`} />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score < 2 ? 'text-red-600' :
                      passwordStrength.score < 4 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.score < 2 ? 'Weak' :
                       passwordStrength.score < 4 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-3 h-3 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-3 h-3 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>Lowercase letter</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-3 h-3 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-3 h-3 ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>Number</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-3 h-3 ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>Special character (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  data-testid="input-confirm-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || passwordStrength.score < 3 || formData.password !== formData.confirmPassword}
              data-testid="button-signup"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login-otp">
                  <Button variant="link" className="p-0 h-auto" data-testid="link-login">
                    Sign in with OTP
                  </Button>
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}