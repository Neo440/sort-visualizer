import { ReactNode } from 'react';
import Bar from '@/components/layout/Sections/Bar';
import ContentArea from '@/components/layout/Sections/ContentArea';
import ControlBoard from '@/components/layout/Sections/ControlBoard';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="flex flex-nowrap h-screen w-full gap-4 p-4">
        <Bar />
        <ContentArea>{children}</ContentArea>
        <ControlBoard />
      </div>
    </div>
  );
} 