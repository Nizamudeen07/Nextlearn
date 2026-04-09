'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { setTokens, saveUser } from '@/lib/auth';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function ProfileStep({ mobile }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    fileRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!name || !email || !qualification || !image) {
      setError('Please fill all fields and upload a profile picture.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('qualification', qualification);
      formData.append('profile_image', image);

      const res = await axiosInstance.post('/auth/create-profile', formData);
      if (res.data.success) {
        setTokens(res.data.access_token, res.data.refresh_token);
        if (res.data.user) saveUser(res.data.user);
        dispatch(loginSuccess({
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
          user: res.data.user,
        }));
        router.push('/exam');
      } else {
        setError(res.data.message || 'Failed to create profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-heading">Add Your Details</h2>

      {/* Profile Image Upload */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {preview ? (
            <div className="auth-upload-card relative">
              <Image
                src={preview}
                alt="Profile preview"
                fill
                sizes="136px"
                className="rounded-[10px] object-cover p-7"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1.5 right-1.5 bg-slate-700 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] cursor-pointer border-none"
                aria-label="Remove profile image"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="auth-upload-card flex-col cursor-pointer bg-transparent hover:border-slate-400 transition-colors"
              aria-label="Upload profile picture"
            >
              <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="#2d3945" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5H7.5A2.25 2.25 0 005.25 9.75v6A2.25 2.25 0 007.5 18h9a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0016.5 7.5h-.75m-7.5 0 .75-1.5A2.25 2.25 0 0111.01 4.5h1.98A2.25 2.25 0 0115 6l.75 1.5m-7.5 0h7.5M12 10.125v5.25M9.375 12.75h5.25" />
              </svg>
              <span className="text-[11px] text-gray-300 mt-2 text-center px-2">Add Your Profile picture</span>
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            className="hidden"
            onChange={handleImage}
          />
        </div>
      </div>

      {/* Name */}
      <div className="input-wrapper mb-6">
        <label htmlFor="profile-name" className="input-label">Name*</label>
        <input
          id="profile-name"
          type="text"
          placeholder="Enter your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Email */}
      <div className="input-wrapper mb-6">
        <label htmlFor="profile-email" className="input-label">Email</label>
        <input
          id="profile-email"
          type="email"
          placeholder="Enter your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Qualification */}
      <div className="input-wrapper mb-5">
        <label htmlFor="profile-qualification" className="input-label">Your qualification*</label>
        <input
          id="profile-qualification"
          type="text"
          placeholder="e.g. B.Tech, MBA..."
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          className="input-field"
        />
      </div>

      {error && <p className="text-red-500 text-xs mb-3" role="alert">{error}</p>}

      <button className="btn-primary mt-2" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating Profile...' : 'Get Started'}
      </button>
    </div>
  );
}
