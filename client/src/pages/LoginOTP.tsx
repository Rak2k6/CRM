import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Shield, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginOTP() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Form states
  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
    password: '',
    useOTP: false
  });
  
  const [otpData, setOtpData] = useState({
    email: '',
    otp: ''
  });
  
  const [currentStep, setCurrentStep] = useState<'login' | 'verify'>('login');
  const [activeTab, setActiveTab] = useState('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For regular login (without OTP)
      if (!loginData.useOTP) {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailOrUsername: loginData.emailOrUsername,
            password: loginData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store authentication data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${data.user.username}!`,
        });

        // Redirect based on role and tab
        if (activeTab === 'admin' && data.user.role !== 'admin') {
          throw new Error('Admin access required');
        }

        if (data.user.role === 'admin' || activeTab === 'admin') {
          setLocation('/admin');
        } else {
          setLocation('/');
        }
      } else {
        // For OTP-based login
        const response = await fetch('/api/auth/login-with-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailOrUsername: loginData.emailOrUsername,
            password: loginData.password,
            useOTP: true,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        if (data.requiresOTP) {
          setOtpData({ email: data.email, otp: '' });
          setCurrentStep('verify');
          toast({
            title: 'Login OTP Sent',
            description: `We've sent a verification code to ${data.email}`,
          });
        } else {
          // Direct login success
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('auth_user', JSON.stringify(data.user));

          toast({
            title: 'Login Successful',
            description: `Welcome back, ${data.user.username}!`,
          });

          if (data.user.role === 'admin' || activeTab === 'admin') {
            setLocation('/admin');
          } else {
            setLocation('/');
          }
        }
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-login-otp', {
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
        title: 'Login Successful',
        description: `Welcome back, ${data.user.username}!`,
      });

      // Redirect based on role and tab
      if (activeTab === 'admin' && data.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      if (data.user.role === 'admin' || activeTab === 'admin') {
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

  const handleResendLoginOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: otpData.email, purpose: 'login' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to resend OTP');
      }

      toast({
        title: 'Code Resent',
        description: 'A new login code has been sent to your email',
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
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Verify Login</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to <strong>{otpData.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyLoginOTP} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="loginOtp">Login Code</Label>
                <Input
                  id="loginOtp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpData.otp}
                  onChange={(e) => setOtpData({ ...otpData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                  required
                  data-testid="input-login-otp"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || otpData.otp.length !== 6}
                data-testid="button-verify-login-otp"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendLoginOTP}
                  disabled={loading}
                  className="p-0 h-auto"
                  data-testid="button-resend-login-otp"
                >
                  Resend Code
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setCurrentStep('login')}
                  className="p-0 h-auto text-sm"
                  data-testid="button-back-login"
                >
                  ← Back to Login
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
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Access your LDR Surveys CRM account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center space-x-2" data-testid="tab-user-login">
                <User className="w-4 h-4" />
                <span>User Login</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center space-x-2" data-testid="tab-admin-login">
                <Shield className="w-4 h-4" />
                <span>Admin Login</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-4 mt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">User Access</h3>
                <p className="text-sm text-muted-foreground">
                  Access to dashboard and CRM features
                </p>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4 mt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Admin Access</h3>
                <p className="text-sm text-muted-foreground">
                  Full access to admin panel and management features
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">Email or Username</Label>
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="Enter email or username"
                value={loginData.emailOrUsername}
                onChange={(e) => setLoginData({ ...loginData, emailOrUsername: e.target.value })}
                required
                data-testid="input-email-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  data-testid="input-login-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-login-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="useOTP"
                checked={loginData.useOTP}
                onCheckedChange={(checked) => setLoginData({ ...loginData, useOTP: checked })}
                data-testid="switch-use-otp"
              />
              <Label htmlFor="useOTP" className="text-sm font-medium">
                Use email verification for enhanced security
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              data-testid="button-login"
            >
              {loading ? (loginData.useOTP ? 'Sending Code...' : 'Signing In...') : 'Sign In'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup-otp">
                  <Button variant="link" className="p-0 h-auto" data-testid="link-signup">
                    Sign up with OTP
                  </Button>
                </Link>
              </p>
              
              {activeTab === 'admin' && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠️ Admin access is restricted to authorized personnel only
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}