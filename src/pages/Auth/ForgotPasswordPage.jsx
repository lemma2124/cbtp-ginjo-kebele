
import React from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useLanguage } from '@/context/LanguageContext';

const ForgotPasswordPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center">
            <div className="h-16 w-16 rounded-full ethiopia-flag-gradient" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">KRFS</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kebele Resident File System
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
