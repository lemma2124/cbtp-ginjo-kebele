import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext();

const ROLES = {
  ADMIN: 'admin',
  OFFICER: 'officer',
  RESIDENT: 'resident',
  STAFF: 'staff',
  DATA_CLERK: 'data_clerk',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('krfs-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("krfs-user");
      }
    }
    setIsLoading(false);
  }, []);

  console.log("AuthProvider initialized with user:", user);
  console.log("IsAuthenticated:", isAuthenticated);
  console.log("IsLoading:", isLoading);
  console.log("IsLoading:", user && user.role);
  // REAL PHP BACKEND LOGIN
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/auth/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem("krfs-user", JSON.stringify(result.user));
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user.name}!`,
        });
        return result;
      } else {
        throw new Error(result.message || "Invalid credentials");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message,
      });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // SEND OTP TO EMAIL
  const sendPasswordResetOTP = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/auth/forgot-password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "OTP Sent",
          description: "A one-time password has been sent to your email.",
        });
        return { success: true };
      } else {
        throw new Error(result.message || "Failed to send OTP");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // VERIFY OTP
  const verifyOTP = async (email, otp) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/auth/verify-otp.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "OTP Verified",
          description: "Your OTP has been verified successfully.",
        });
        return { success: true };
      } else {
        throw new Error(result.message || "Invalid or expired OTP");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err.message,
      });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // RESET PASSWORD
  const resetPassword = async (email, newPassword, otp) => {a
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/auth/reset-password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword, otp }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Password Reset",
          description: "Your password has been reset successfully.",
        });
        return { success: true };
      } else {
        throw new Error(result.message || "Failed to reset password");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: err.message,
      });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    fetch("http://localhost/krfs-api/api/auth/logout.php", {
      method: "POST",
    }).finally(() => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("krfs-user");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    sendPasswordResetOTP,
    verifyOTP,
    resetPassword,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);