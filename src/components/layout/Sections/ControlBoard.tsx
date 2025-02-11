import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export type ShuffleType = 'random' | 'reversed' | 'nearly-sorted' | 'few-unique';

interface ControlBoardProps {
  numElements: number;
  speed: number;
  status: 'idle' | 'sorting' | 'aborted' | 'sorted';
  onNumElementsChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onShuffle: (type: ShuffleType) => Promise<void>;
  onSort: () => Promise<void>;
  onAbort: () => void;
}

export default function ControlBoard({
  numElements,
  speed,
  status,
  onNumElementsChange,
  onSpeedChange,
  onShuffle,
  onSort,
  onAbort,
}: ControlBoardProps) {
  const [blink, setBlink] = useState(false);
  const presetSizes = [10, 20, 25, 30];

  useEffect(() => {
    if (status === 'sorting') {
      const interval = setInterval(() => setBlink(!blink), 500);
      return () => clearInterval(interval);
    }
    setBlink(false);
  }, [status, blink]);

  return (
    <div className="w-[45%] border-2 border-gray-200 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Controls</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <div className={cn(
            'w-2 h-2 rounded-full flex items-center justify-center',
            {
              'border-gray-400 bg-gray-200': status === 'idle',
              'border-yellow-600 bg-yellow-500/80 animate-pulse': status === 'sorting',
              'border-red-600 bg-red-500/80': status === 'aborted',
              'border-green-600 bg-green-500/80': status === 'sorted',
            }
          )}>
            {status === 'sorting' && (
              <div className="w-3 h-3 bg-yellow-200 rounded-full animate-ping" />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Array Size</label>
            <span className="text-sm text-gray-500 font-medium">{numElements}</span>
          </div>
          <div className="flex gap-3">
            {presetSizes.map((size) => (
              <Button
                key={size}
                variant={numElements === size ? 'default' : 'secondary'}
                className="flex-1"
                onClick={() => onNumElementsChange(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Speed</label>
            <span className="text-sm text-gray-500 font-medium">{speed}x</span>
          </div>
          <Slider
            min={1}
            max={10}
            value={[speed]}
            onValueChange={(v) => onSpeedChange(v[0])}
            className="[&_[role=slider]]:h-10 [&_[role=slider]]:w-2 py-4"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onShuffle('random')}
            variant="outline"
            className="gap-2 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Random
          </Button>
          
          <Button
            onClick={() => onShuffle('reversed')}
            variant="outline"
            className="gap-2 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Reversed
          </Button>

          <Button
            onClick={() => onShuffle('nearly-sorted')}
            variant="outline"
            className="gap-2 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5h7m-7 7h7m-7 7h7M4 8h1.5m0 0H6m-1.5 0V6m0 2v2M4 16h1.5m0 0H6m-1.5 0V14m0 2v2" />
            </svg>
            Nearly Sorted
          </Button>

          <Button
            onClick={() => onShuffle('few-unique')}
            variant="outline"
            className="gap-2 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Few Unique
          </Button>
        </div>
        <div className='flex gap-2'>
        <Button 
          onClick={onSort} 
          className="gap-2 w-full hover:bg-gray-600 transition-colors"
          disabled={status === 'sorting'}
          onMouseDown={(e) => e.preventDefault()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Start Sort
        </Button>

        <Button 
          onClick={onAbort} 
          variant="destructive" 
          className="gap-2 w-full hover:bg-red-700 transition-colors"
          disabled={status !== 'sorting'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Abort Sort
        </Button>
        </div>
      </div>
    </div>
  );
} 