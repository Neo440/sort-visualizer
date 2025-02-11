import { ReactNode } from 'react';

interface VisualizerSectionProps {
  children: ReactNode;
}

export default function VisualizerSection({ children }: VisualizerSectionProps) {
  return (
    <div className="w-[40%] border-2 border-gray-200 shadow-lg rounded-xl bg-white p-4">
      {children}
    </div>
  );
} 