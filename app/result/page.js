'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { resetExam, setResult } from '@/store/slices/examSlice';
import { isAuthenticated, getExamResult, clearExamResult } from '@/lib/auth';
import Navbar from '@/components/ui/Navbar';

export default function ResultPage() {
  const { result } = useSelector((s) => s.exam);
  const dispatch = useDispatch();
  const router = useRouter();
  const persistedResult = useMemo(() => getExamResult(), []);
  const resolvedResult = result || persistedResult;

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    if (!result && persistedResult) {
      dispatch(setResult(persistedResult));
      return;
    }
    if (!result && !persistedResult) { router.replace('/exam'); }
  }, [result, persistedResult, dispatch, router]);

  const handleDone = () => {
    clearExamResult();
    dispatch(resetExam());
    router.push('/exam');
  };

  if (!resolvedResult) return null;

  const pad = (n) => String(n ?? 0).padStart(3, '0');

  const stats = [
    { label: 'Total Questions:', value: pad(resolvedResult.correct + resolvedResult.wrong + resolvedResult.not_attended), color: 'bg-yellow-500', icon: '📋' },
    { label: 'Correct Answers:', value: pad(resolvedResult.correct), color: 'bg-green-600', icon: '✔' },
    { label: 'Incorrect Answers:', value: pad(resolvedResult.wrong), color: 'bg-red-500', icon: '✖' },
    { label: 'Not Attended Questions:', value: pad(resolvedResult.not_attended), color: 'bg-gray-500', icon: '—' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0f7ff' }}>
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-md space-y-4 sm:space-y-5">
          {/* Score Card */}
          <div
            className="w-full rounded-xl text-white text-center py-7 px-5 sm:py-8 sm:px-6"
            style={{ background: 'linear-gradient(135deg, #0d7377 0%, #1a3c5e 100%)' }}
          >
            <p className="text-sm font-medium text-blue-200 mb-2">Marks Obtained:</p>
            <p className="text-4xl sm:text-6xl font-bold break-words">
              {resolvedResult.score} / {resolvedResult.correct + resolvedResult.wrong + resolvedResult.not_attended}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-white text-xs`}>
                    {s.icon}
                  </span>
                  <span className="text-sm text-gray-700">{s.label}</span>
                </div>
                <span className="font-bold text-gray-900 text-base shrink-0">{s.value}</span>
              </div>
            ))}
          </div>

          <button type="button" onClick={handleDone} className="btn-primary">
            Done
          </button>
        </div>
      </main>
    </div>
  );
}
