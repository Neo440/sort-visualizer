import { ReactNode } from 'react';
import SortingLegend from '@/components/common/SortingLegend';

interface VisualizerSectionProps {
  children: ReactNode;
  selectedAlgorithm: keyof typeof legendConfig;
}

export default function VisualizerSection({ children, selectedAlgorithm }: VisualizerSectionProps) {
  return (
    <div className="w-[40%] border-2 border-gray-200 shadow-lg rounded-xl bg-white p-4">
      <SortingLegend algorithm={selectedAlgorithm} />
      <div className="h-[calc(100%-56px)]">
        {children}
      </div>
    </div>
  );
} 