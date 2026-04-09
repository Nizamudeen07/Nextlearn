import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'NexLearn - Futuristic Learning',
  description: 'Take your MCQ exams online with NexLearn, the futuristic learning platform.',
  keywords: 'NexLearn, online exam, MCQ, learning, education',
  openGraph: {
    title: 'NexLearn - Futuristic Learning',
    description: 'Take your MCQ exams online with NexLearn.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
