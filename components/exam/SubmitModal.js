'use client';
import { useSelector } from 'react-redux';

export default function SubmitModal({ remainingTime, onConfirm, onCancel }) {
  const { questions, answers, markedForReview } = useSelector((s) => s.exam);

  const answered = Object.keys(answers).filter(k => answers[k] != null).length;
  const marked = markedForReview.length;
  const total = questions.length;

  const pad = (n) => String(n).padStart(3, '0');
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="submit-modal-title">
        <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
          <h3 id="submit-modal-title" className="font-semibold text-gray-800 text-sm sm:text-base">Are you sure you want to submit the test?</h3>
          <button type="button" onClick={onCancel} className="text-gray-400 text-xl bg-transparent border-none cursor-pointer hover:text-gray-600" aria-label="Close submit dialog">✕</button>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#1a3c5e' }}>⏱</span>
              <span className="text-sm text-gray-700">Remaining Time:</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">{formatTime(remainingTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs bg-yellow-500">📋</span>
              <span className="text-sm text-gray-700">Total Questions:</span>
            </div>
            <span className="font-semibold text-gray-900">{total}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs bg-green-600">✔</span>
              <span className="text-sm text-gray-700">Questions Answered:</span>
            </div>
            <span className="font-semibold text-gray-900">{pad(answered)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs bg-purple-700">🔖</span>
              <span className="text-sm text-gray-700">Marked for review:</span>
            </div>
            <span className="font-semibold text-gray-900">{pad(marked)}</span>
          </div>
        </div>

        <button type="button" onClick={onConfirm} className="btn-primary">
          Submit Test
        </button>
      </div>
    </div>
  );
}
