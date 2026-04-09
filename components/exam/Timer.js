'use client';

export default function Timer({ totalSeconds }) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold text-sm"
      style={{ backgroundColor: '#1a3c5e' }}
      aria-live="polite"
    >
      <span className="w-4 h-4 rounded-full bg-gray-400 inline-block" aria-hidden="true" />
      {display}
    </div>
  );
}
