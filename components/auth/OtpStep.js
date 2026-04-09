'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { setTokens } from '@/lib/auth';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function OtpStep({ mobile, onBack, onNeedsProfile }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleVerify = async () => {
    const normalizedOtp = otp.replace(/\D/g, '');

    if (normalizedOtp.length < 4) {
      setError('Please enter the OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('mobile', mobile);
      payload.append('otp', normalizedOtp);

      const res = await axiosInstance.post('/auth/verify-otp', payload);

      if (res.data.success) {
        if (res.data.login) {
          // User exists, go to exam
          setTokens(res.data.access_token, res.data.refresh_token);
          dispatch(loginSuccess({
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
          }));
          router.push('/exam');
        } else {
          // New user, needs profile
          onNeedsProfile(mobile);
        }
      } else {
        setError(res.data.message || 'Invalid OTP.');
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Unable to verify OTP. Please try again.';
      setError(String(apiMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg('');
    try {
      const payload = new FormData();
      payload.append('mobile', mobile);

      const res = await axiosInstance.post('/auth/send-otp', payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to resend OTP.');
      }
      setResendMsg('OTP resent successfully!');
    } catch (err) {
      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Failed to resend OTP.';
      setResendMsg(String(apiMessage));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-heading">Enter the code we texted you</h2>
      <p className="auth-subheading max-w-sm">
        We&apos;ve sent an SMS to {mobile}
      </p>

      <div className="input-wrapper mb-4">
        <label htmlFor="otp-code" className="input-label">SMS code</label>
        <input
          id="otp-code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="123 456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="input-field"
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
        />
      </div>

      {error && <p className="text-red-500 text-xs mb-2" role="alert">{error}</p>}

      <p className="auth-help mb-5 max-w-sm">
        Your 6 digit code is on its way. This can sometimes take a few moments to arrive.
      </p>
      <button
        onClick={handleResend}
        disabled={resendLoading}
        className="auth-link text-base cursor-pointer auth-resend-spacing bg-transparent border-none"
      >
        {resendLoading ? 'Resending...' : 'Resend code'}
      </button>
      {resendMsg && <p className="text-green-600 text-xs mb-2">{resendMsg}</p>}

      <button className="btn-primary" onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Get Started'}
      </button>

      <button
        onClick={onBack}
        className="w-full mt-3 text-sm text-gray-500 underline bg-transparent border-none cursor-pointer"
      >
        ← Change number
      </button>
    </div>
  );
}
