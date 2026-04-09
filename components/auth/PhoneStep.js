'use client';
import { useState } from 'react';
import axiosInstance from '@/lib/axios';

export default function PhoneStep({ onNext }) {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const normalizedMobile = mobile.replace(/\D/g, '').slice(-10);
    const fullMobile = `+91${normalizedMobile}`;

    if (normalizedMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('mobile', fullMobile);

      const res = await axiosInstance.post('/auth/send-otp', payload);

      if (res.data.success) {
        onNext(fullMobile);
      } else {
        setError(res.data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Unable to send OTP. Please check the mobile number and try again.';
      setError(String(apiMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-heading">Enter your phone number</h2>
      <p className="auth-subheading max-w-sm">
        We use your mobile number to identify your account
      </p>

      <div className="input-wrapper mb-4">
        <label htmlFor="phone-number" className="input-label">Phone number</label>
        <div className="flex items-center input-field gap-2 pr-0 pl-3">
          <span className="text-lg" aria-hidden="true">🇮🇳</span>
          <span className="text-slate-600 text-[15px] font-medium" aria-hidden="true">+91</span>
          <input
            id="phone-number"
            type="tel"
            maxLength={10}
            placeholder="1234 567891"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            className="flex-1 outline-none text-[15px] py-0 bg-transparent text-slate-700"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-3" role="alert">{error}</p>}

      <p className="auth-help auth-disclaimer">
        By tapping Get started, you agree to the{' '}
        <span className="auth-link cursor-pointer">Terms & Conditions</span>
      </p>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Sending OTP...' : 'Get Started'}
      </button>
    </div>
  );
}
