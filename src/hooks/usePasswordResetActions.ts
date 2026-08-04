import { useState } from "react";
import apiClient from "@/lib/axios";

export const usePasswordResetActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/forgot-password", { email });
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ?? "حدث خطأ أثناء إرسال رمز التحقق.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/resend-otp", { email });
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ?? "حدث خطأ أثناء إعادة إرسال الرمز.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyResetOtp = async (email: string, otp: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/verify-reset-otp", { email, otp });
      return true;
    } catch (err) {
      setError(err.response?.data?.message ?? "رمز التحقق غير صحيح.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/verify-otp", { email, otp });
      return true;
    } catch (err) {
      setError(err.response?.data?.message ?? "رمز التحقق غير صحيح.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/reset-password", {
        email,
        otp,
        password,
        password_confirmation: passwordConfirmation,
      });
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ?? "حدث خطأ أثناء تغيير كلمة المرور.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePassword = async (
    password: string,
    passwordConfirmation: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.patch("/student/updateProfile", {
        password,
        password_confirmation: passwordConfirmation,
      });
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ?? "حدث خطأ أثناء تغيير كلمة المرور.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    requestOtp,
    resendOtp,
    verifyResetOtp,
    verifyOtp,
    resetPassword,
    updateProfilePassword,
    loading,
    error,
  };
};
