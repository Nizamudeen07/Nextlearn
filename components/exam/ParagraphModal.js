'use client';
import { useDispatch, useSelector } from 'react-redux';
import { setParagraphVisible } from '@/store/slices/examSlice';

export default function ParagraphModal({ paragraph }) {
  const dispatch = useDispatch();
  const visible = useSelector((s) => s.exam.paragraphVisible);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="paragraph-modal-title">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 border-b border-gray-200">
          <h3 id="paragraph-modal-title" className="font-semibold text-gray-800 text-sm sm:text-base">Comprehensive Paragraph</h3>
          <button
            type="button"
            onClick={() => dispatch(setParagraphVisible(false))}
            className="text-gray-400 hover:text-gray-600 text-xl bg-transparent border-none cursor-pointer"
            aria-label="Close paragraph dialog"
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-4 sm:px-6 overflow-y-auto flex-1 text-sm text-gray-700 leading-relaxed">
          {paragraph || 'No paragraph available for this question.'}
        </div>
        <div className="px-4 py-4 sm:px-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => dispatch(setParagraphVisible(false))}
            className="btn-primary max-w-xs mx-auto block"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
}
