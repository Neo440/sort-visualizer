import { ReactNode } from 'react';
import Bar from '@/components/layout/Sections/Bar';
import ControlBoard from '@/components/layout/Sections/ControlBoard';
import { ShuffleType } from '@/components/layout/Sections/ControlBoard';
import CodeSection from './Sections/CodeSection';
import VisualizerSection from '@/components/layout/Sections/VisualizerSection';

interface DashboardLayoutProps {
  children: ReactNode;
  controlProps: {
    numElements: number;
    speed: number;
    status: 'idle' | 'sorting' | 'aborted' | 'sorted';
    onNumElementsChange: (value: number) => void;
    onSpeedChange: (value: number) => void;
    onShuffle: (type: ShuffleType) => Promise<void>;
    onSort: () => Promise<void>;
    onAbort: () => void;
  };
}

export default function DashboardLayout({ children, controlProps }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="flex flex-nowrap h-screen w-full gap-4 p-4">
        <CodeSection/>
        <Bar />
        <VisualizerSection>{children}</VisualizerSection>
        <ControlBoard {...controlProps} />
      </div>
    </div>
  );
} 