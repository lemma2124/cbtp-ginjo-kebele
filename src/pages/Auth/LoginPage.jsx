
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const { t, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 ethiopia-pattern opacity-30"></div>
        <div className="w-full max-w-md space-y-8 z-10">
          <div className="text-center">
            <div className="flex justify-center items-center">
              <div className="h-16 w-16 rounded-full ethiopia-flag-gradient shadow-lg"></div>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">Kebele Resident File System</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Secure, efficient resident management for Ethiopian Kebeles
            </p>
          </div>
          <div className="card-glass rounded-xl p-6 mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ethiopia-green/90 to-ethiopia-green opacity-90"></div>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 10 }).map((_, i) => (
              <line 
                key={i} 
                x1="0" 
                y1={i * 10} 
                x2="100" 
                y2={i * 10 + 5} 
                stroke="currentColor" 
                strokeWidth="0.5" 
              />
            ))}
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-md text-white z-10">
            <h2 className="text-3xl font-bold mb-6 animate-fade-in">
              ወደ ቀበሌ ነዋሪ ፋይል ሥርዓት እንኳን ደህና መጡ
            </h2>
            <p className="mb-8 leading-relaxed">
              Modern resident management system for Ethiopian Kebeles. Securely access resident information, manage documents, and streamline services.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="text-white border-white/30 hover:bg-white/20 backdrop-blur-sm button-shine"
                onClick={toggleLanguage}
              >
                Switch Language
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
