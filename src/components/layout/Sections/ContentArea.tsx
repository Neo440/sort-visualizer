import { ReactNode } from 'react';

interface ContentAreaProps {
  children: ReactNode;
}

export default function ContentArea({ children }: ContentAreaProps) {
  return (
    <div className="w-[65%] border-2 border-gray-200 rounded-lg bg-white p-4">
      {children}
    </div>
  );
} 