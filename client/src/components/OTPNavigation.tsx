import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Shield, Mail } from 'lucide-react';

interface OTPNavigationProps {
  currentPage: 'login' | 'signup';
}

export function OTPNavigation({ currentPage }: OTPNavigationProps) {
  return (
    <div className="border-t pt-4 mt-4">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enhanced Security Available
          </p>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Email verification with OTP for additional account protection
        </p>
        
        <div className="flex space-x-3 justify-center">
          {currentPage === 'login' ? (
            <>
              <Link href="/login-otp">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Mail className="w-3 h-3" />
                  <span>OTP Login</span>
                </Button>
              </Link>
              <Link href="/signup-otp">
                <Button variant="link" size="sm" className="text-xs">
                  or OTP Signup
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup-otp">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Mail className="w-3 h-3" />
                  <span>OTP Signup</span>
                </Button>
              </Link>
              <Link href="/login-otp">
                <Button variant="link" size="sm" className="text-xs">
                  or OTP Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}