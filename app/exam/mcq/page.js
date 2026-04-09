'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setAnswer, toggleMarkForReview, setCurrentIndex, setResult, setParagraphVisible } from '@/store/slices/examSlice';
import { isAuthenticated, saveExamResult } from '@/lib/auth';
import axiosInstance from '@/lib/axios';
import Navbar from '@/components/ui/Navbar';
import QuestionSheet from '@/components/exam/QuestionSheet';
import Timer from '@/components/exam/Timer';
import SubmitModal from '@/components/exam/SubmitModal';
import ParagraphModal from '@/components/exam/ParagraphModal';

export default function MCQPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { questions, currentIndex, answers, markedForReview, totalTime, examStarted, paragraphVisible } = useSelector((s) => s.exam);
  const [showSubmit, setShowSubmit] = useState(false);
  const [remainingTime, setRemainingTime] = useState(totalTime || 5400);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    if (!examStarted || questions.length === 0) { router.replace('/exam'); }
  }, [examStarted, questions, router]);

  useEffect(() => {
    setRemainingTime(totalTime || 5400);
  }, [totalTime]);

  const currentQ = questions[currentIndex];

  const handleAnswer = (optionId) => {
    if (!currentQ) return;
    dispatch(setAnswer({ question_id: currentQ.id, option_id: optionId }));
  };

  const handleMarkReview = () => {
    if (!currentQ) return;
    dispatch(toggleMarkForReview(currentQ.id));
  };

  const handleSubmitConfirm = useCallback(async () => {
    setShowSubmit(false);
    setSubmitting(true);
    setSubmitError('');
    try {
      const answersArr = questions.map((q) => ({
        question_id: Number(q.id),
        selected_option_id: answers[q.id] != null ? Number(answers[q.id]) : null,
      }));
      const payload = new FormData();
      payload.append('answers', JSON.stringify(answersArr));

      const res = await axiosInstance.post('/answers/submit', payload);

      if (res.data.success) {
        saveExamResult(res.data);
        dispatch(setResult(res.data));
        router.push('/result');
      } else {
        setSubmitError(res.data.message || 'Failed to submit answers.');
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Failed to submit answers. Please try again.';
      setSubmitError(String(apiMessage));
    } finally {
      setSubmitting(false);
    }
  }, [answers, questions, dispatch, router]);

  // Track remaining time in one place to avoid duplicate countdowns/submits.
  const timerRef = useRef(null);
  useEffect(() => {
    if (!examStarted || questions.length === 0) return undefined;

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [examStarted, questions.length, handleSubmitConfirm]);

  if (!currentQ) return null;

  const isMarked = markedForReview.includes(currentQ.id);
  const selectedOption = answers[currentQ.id];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Sub-header bar */}
      <div className="bg-white border-b border-gray-200 px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <span className="font-medium text-gray-700 text-sm sm:text-base truncate">
            {currentQ.exam_title || 'Ancient Indian History MCQ'}
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm">
            <span className="text-gray-500 whitespace-nowrap">
              {String(currentIndex + 1).padStart(2,'0')}/{questions.length}
            </span>
            <span className="font-medium text-gray-700 hidden sm:inline">Question No. Sheet:</span>
            <span className="text-gray-500 hidden sm:inline">Remaining Time:</span>
            <Timer totalSeconds={remainingTime} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Question Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-4 md:p-6 min-w-0">

          {/* Paragraph button */}
          {currentQ.paragraph && (
            <button
              type="button"
              onClick={() => dispatch(setParagraphVisible(true))}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg w-fit"
              style={{ backgroundColor: '#1a3c5e' }}
            >
              <span aria-hidden="true">📄</span> Read Comprehensive Paragraph
            </button>
          )}

          {/* Question */}
          <p className="text-gray-800 font-medium mb-4 text-sm md:text-base">
            {currentIndex + 1}. {currentQ.question}
          </p>

          {/* Question image */}
          {currentQ.image && (
            <Image
              src={currentQ.image}
              alt="Question visual"
              width={500}
              height={208}
              sizes="(max-width: 768px) 100vw, 500px"
              className="mb-4 rounded-lg max-h-52 w-full h-auto object-contain border border-gray-200"
            />
          )}

          <p className="text-xs text-gray-500 mb-3">Choose the answer:</p>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options?.map((opt, i) => {
              const labels = ['A', 'B', 'C', 'D', 'E'];
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  aria-pressed={isSelected}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer
                    ${isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-medium'
                      : 'border-gray-200 bg-white hover:border-gray-400 text-gray-700'
                    }`}
                >
                  <span className="font-medium mr-2">{labels[i]}.</span> {opt.option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Question Sheet */}
        <div className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-600 mb-3">Question Numbers:</p>
          <QuestionSheet />
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-200 px-3 py-3 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleMarkReview}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold border-2 transition-all cursor-pointer
            ${isMarked ? 'bg-purple-700 text-white border-purple-700' : 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700'}`}
        >
          {isMarked ? '★ Marked' : 'Mark for review'}
        </button>
        <button
          type="button"
          onClick={() => dispatch(setCurrentIndex(Math.max(0, currentIndex - 1)))}
          disabled={currentIndex === 0}
          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
        >
          Previous
        </button>
        {currentIndex === questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setShowSubmit(true)}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer"
            style={{ backgroundColor: '#1a3c5e' }}
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => dispatch(setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1)))}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer"
            style={{ backgroundColor: '#1a3c5e' }}
          >
            Next
          </button>
        )}
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border-t border-red-200 px-4 py-3">
          <p className="text-sm text-red-600" role="alert">{submitError}</p>
        </div>
      )}

      {/* Mobile Question Sheet toggle */}
      <div className="lg:hidden bg-white border-t border-gray-200 px-3 py-2 sm:px-4">
        <details>
          <summary className="text-sm text-gray-500 cursor-pointer">Question Number Sheet</summary>
          <div className="pt-2 pb-1"><QuestionSheet /></div>
        </details>
      </div>

      {showSubmit && (
        <SubmitModal
          remainingTime={remainingTime}
          onConfirm={handleSubmitConfirm}
          onCancel={() => setShowSubmit(false)}
        />
      )}

      {paragraphVisible && <ParagraphModal paragraph={currentQ.paragraph} />}

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="status" aria-live="polite">
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-700 font-medium">Submitting your answers...</p>
          </div>
        </div>
      )}
    </div>
  );
}
