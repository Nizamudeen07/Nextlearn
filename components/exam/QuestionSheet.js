'use client';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentIndex } from '@/store/slices/examSlice';

export default function QuestionSheet() {
  const dispatch = useDispatch();
  const { questions, currentIndex, answers, markedForReview } = useSelector((s) => s.exam);

  const getStatus = (q) => {
    const answered = answers[q.id] != null;
    const marked = markedForReview.includes(q.id);
    if (answered && marked) return 'answered-marked'; // purple/pink
    if (marked) return 'marked';                       // purple
    if (answered) return 'attended';                   // green
    return 'not-attended';                             // red
  };

  const statusColors = {
    'attended': 'bg-green-600 text-white',
    'not-attended': 'bg-red-500 text-white',
    'marked': 'bg-purple-700 text-white',
    'answered-marked': 'bg-pink-600 text-white',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-5 gap-1 overflow-y-auto flex-1 content-start">
        {questions.map((q, i) => {
          const status = getStatus(q);
          const isCurrent = i === currentIndex;
          const key = q?.id != null ? `${q.id}-${i}` : `question-${i}`;
          return (
            <button
              key={key}
              onClick={() => dispatch(setCurrentIndex(i))}
              className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center cursor-pointer border-2 transition-all
                ${statusColors[status]}
                ${isCurrent ? 'border-gray-800 ring-2 ring-gray-400' : 'border-transparent'}
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-1 text-xs text-gray-600">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-600 inline-block" />Attended</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />Not Attended</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-700 inline-block" />Marked For Review</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-pink-600 inline-block" />Answered &amp; Marked</div>
      </div>
    </div>
  );
}
