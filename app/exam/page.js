'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  setQuestions,
  setLoading,
  setError,
  startExam,
} from '@/store/slices/examSlice';
import { isAuthenticated } from '@/lib/auth';
import axiosInstance from '@/lib/axios';
import Navbar from '@/components/ui/Navbar';

export default function ExamInstructionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    questionsCount,
    totalMarks,
    totalTime,
    instruction,
    loading,
    error,
  } = useSelector((s) => s.exam);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    const fetchQuestions = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axiosInstance.get('/question/list');

        if (res.data?.success) {
          dispatch(setQuestions(res.data));
        } else {
          dispatch(setError(res.data?.message || 'Invalid response from server'));
        }
      } catch (err) {
        dispatch(
          setError(
            err.response?.data?.message ||
            err.response?.data?.detail ||
            'Failed to load exam.'
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchQuestions();
  }, [dispatch, router]);

  const handleStartTest = () => {
    if (!questionsCount) return; // ✅ prevent empty exam
    dispatch(startExam());
    router.push('/exam/mcq');
  };

  // ✅ Improved time formatter
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00';

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const instructionLines = instruction
    ? instruction.split('\n').filter(Boolean)
    : [
        'You have 100 minutes to complete the test.',
        'Test consists of 100 multiple-choice questions.',
        'You are allowed 2 retest attempts if you do not pass on the first try.',
        'Each incorrect answer will incur a negative mark of -1/4.',
        'Ensure you are in a quiet environment and have a stable internet connection.',
        'Keep an eye on the timer, and try to answer all questions within the given time.',
        'Do not use any external resources such as dictionaries, websites, or assistance.',
        'Complete the test honestly to accurately assess your proficiency level.',
        'Check answers before submitting.',
        'Your test results will be displayed immediately after submission, indicating whether you have passed or need to retake the test.',
      ];
  const hasInstructionHtml = /<\s*(ol|ul|li|p|br)\b/i.test(instruction || '');

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#f0f7ff' }}
    >
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-10">
        <h1 className="text-[28px] md:text-[29px] font-medium text-slate-800 mb-7 text-center">
          Ancient Indian History MCQ
        </h1>

        {loading && (
          <p className="text-gray-500">Loading exam details...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {/* Stats Card */}
        <div
          className="w-full max-w-[682px] rounded-[9px] text-white mb-6 md:mb-7 grid grid-cols-3 overflow-hidden"
          style={{ backgroundColor: '#24394b' }}
        >
          <div className="flex flex-col items-center justify-center py-7 md:py-8 border-r border-white/70">
            <p className="text-sm font-semibold text-white/95">
              Total MCQ&apos;s:
            </p>
            <p className="text-[42px] md:text-[43px] font-light mt-3 leading-none">
              {questionsCount ?? 100}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-7 md:py-8 border-r border-white/70">
            <p className="text-sm font-semibold text-white/95">
              Total marks:
            </p>
            <p className="text-[42px] md:text-[43px] font-light mt-3 leading-none">
              {totalMarks ?? 100}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-7 md:py-8">
            <p className="text-sm font-semibold text-white/95">
              Total time:
            </p>
            <p className="text-[42px] md:text-[43px] font-light mt-3 leading-none">
              {totalTime ? formatTime(totalTime) : '90:00'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="w-full max-w-[682px]">
          <p className="font-semibold text-[18px] text-slate-600 mb-3">
            Instructions:
          </p>

          {hasInstructionHtml ? (
            <div
              className="text-[17px] leading-[1.55] text-slate-500 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:pl-1"
              dangerouslySetInnerHTML={{ __html: instruction }}
            />
          ) : (
            <ol className="list-decimal pl-6 space-y-2 text-[17px] leading-[1.55] text-slate-500">
              {instructionLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          )}

          <div className="mt-7 md:mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleStartTest}
              disabled={loading}
              className="btn-primary max-w-[362px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Preparing...' : 'Start Test'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
