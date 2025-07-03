import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, Label } from "../components/ui";

const VerifyOTPPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await verifyOTP(email, otp);
      if (result.success) {
        navigate("/reset-password", {
          state: { email, otp }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <p className="mb-4 text-sm text-gray-600">Enter the code sent to your email.</p>

        <div className="space-y-2 mb-4">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2 mb-4">
          <Label>OTP</Label>
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            maxLength={6}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full mt-2">
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </div>
  );
};


export default VerifyOTPPage;