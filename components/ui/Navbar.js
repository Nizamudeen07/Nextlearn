'use client';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';
import { clearTokens } from '@/lib/auth';
import axiosInstance from '@/lib/axios';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Clearing local auth state is the critical frontend logout behavior.
    } finally {
      clearTokens();
      dispatch(logout());
      router.replace('/login');
    }
  };

  return (
    <header className="w-full bg-white shadow-sm px-3 py-3 sm:px-4 md:px-10">
      <div className="relative flex items-center justify-between gap-3 md:min-h-[56px]">
        <div className="flex items-center gap-2.5 min-w-0 md:absolute md:left-1/2 md:-translate-x-1/2">
          <div className="w-10 h-10 shrink-0 sm:w-12 sm:h-12">
          <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 24.5L38.5 5L63 22.5L33.5 42L9 24.5Z" fill="#0A7FA5" />
            <path d="M19 32.5V46.5C19 54 25.5 60 33 60H42.5C50 60 56.5 54 56.5 46.5V30.5L33.5 46L19 32.5Z" fill="#072430" />
            <path d="M47.5 35.2L58.2 27.8L61.8 42.4" stroke="#072430" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M31.5 41L48.2 29.8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-base leading-tight text-sky-700 sm:text-[18px] truncate">NexLearn</p>
            <p className="text-slate-500 text-[10px] tracking-[0.02em] truncate">futuristic learning</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 text-white text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-sky-700 transition-colors bg-sky-700 sm:text-sm sm:px-6 sm:py-3"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
