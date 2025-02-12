import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ShuffleType = 'random' | 'reversed' | 'nearly-sorted' | 'few-unique';

type StatusType = 'idle' | 'sorting' | 'aborted' | 'sorted';

interface ControlBoardProps {
  numElements: number;
  speed: number;
  status: StatusType;
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
  const presetSizes = [10, 15, 20, 25, 30];

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
          <div className="flex items-center gap-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium capitalize"
              >
                {status === 'sorting' ? (
                  <span className="flex items-center">
                    Sorting
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="flex"
                    >
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}
                      >.</motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, times: [0.2, 0.7, 1] }}
                      >.</motion.span>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, times: [0.4, 0.9, 1] }}
                      >.</motion.span>
                    </motion.span>
                  </span>
                ) : (
                  status
                )}
              </motion.span>
            </AnimatePresence>
            <motion.div
              key={status}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={cn(
                'w-2 h-2 rounded-full',
                {
                  'bg-gray-400': status === 'idle',
                  'bg-yellow-500 animate-pulse': status === 'sorting',
                  'bg-red-600': status === 'aborted',
                  'bg-green-600': status === 'sorted',
                }
              )}
            />
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
                disabled={status === 'sorting'}
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
            disabled={status === 'sorting'}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onShuffle('random')}
            variant="outline"
            className="gap-2 hover:bg-gray-50"
            disabled={status === 'sorting'}
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
            disabled={status === 'sorting'}
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
            disabled={status === 'sorting'}
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
            disabled={status === 'sorting'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Few Unique
          </Button>
        </div>
        <div className='flex gap-2'>
          <motion.div className="flex gap-2 w-full">
            <Button 
              onClick={onSort} 
              className="gap-2 w-full hover:bg-gray-600 transition-colors"
              disabled={status === 'sorting'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {status === 'sorting' ? 'Sorting...' : 'Start Sort'}
            </Button>
            
            <Button 
              onClick={onAbort} 
              variant="destructive" 
              size="icon"
              className="hover:bg-red-700 transition-colors"
              disabled={status !== 'sorting'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 