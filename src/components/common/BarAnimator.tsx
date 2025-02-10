import { useState, useEffect, useMemo, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

interface BarData {
  id: string;
  value: number;
  originalIndex: number;
}

interface BarAnimatorProps {
  data: number[];
  speed: number;
}

const Chevron = ({ visible }: { visible: boolean }) => (
  <svg
    className={`absolute left-0 -translate-x-3/4 -ml-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity duration-300 ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const BarAnimator = forwardRef(({ data, speed }: BarAnimatorProps, ref) => {
  const [currentData, setCurrentData] = useState<BarData[]>(() =>
    data.map((value, index) => ({
      id: `bar-${index}-${value}`,
      value,
      originalIndex: index,
    }))
  );

  const [swappingIds, setSwappingIds] = useState<string[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    if (JSON.stringify(data) === JSON.stringify(currentData.map(d => d.value))) return;
    
    setCurrentData(prev => {
      const existingBars = new Map<string, BarData>();
      prev.forEach(bar => {
        const key = `${bar.originalIndex}-${bar.value}`;
        existingBars.set(key, bar);
      });

      return data.map((value, index) => {
        const key = `${index}-${value}`;
        return existingBars.get(key) || {
          id: `bar-${index}-${value}`,
          value,
          originalIndex: index
        };
      });
    });
  }, [data]);

  const maxValue = useMemo(() => Math.max(...data), [data]);
  const barHeight = useMemo(() => {
    const containerHeight = 384 - 48; // Calculate from actual h-96 (384px) and p-6 (48px)
    return (containerHeight - (data.length - 1) * 8) / data.length;
  }, [data.length]);

  const containerHeight = 336; // 384px (h-96) - 48px (p-6)
  const gap = 8;

  const calculatePosition = useCallback((index: number) => 
    index * (barHeight + 8), [barHeight]
  );

  const bubbleSort = async () => {
    const currentSpeed = speed;
    setIsSorting(true);
    let dataCopy = [...currentData];
    let n = dataCopy.length;
    let swapped: boolean;

    // Store original indexes for animation reference
    const originalIndexMap = new Map(dataCopy.map((bar, index) => [bar.id, index]));

    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        if (!isMounted.current) return; // Prevent state updates if unmounted
        
        setCurrentIndices([i, i + 1]);
        await new Promise(resolve => setTimeout(resolve, 500 / currentSpeed));

        if (dataCopy[i].value > dataCopy[i + 1].value) {
          // Animate the swap
          setSwappingIds([dataCopy[i].id, dataCopy[i + 1].id]);
          [dataCopy[i], dataCopy[i + 1]] = [dataCopy[i + 1], dataCopy[i]];
          swapped = true;

          // Update state with new positions
          setCurrentData([...dataCopy]);
          await new Promise(resolve => setTimeout(resolve, 1000 / currentSpeed));
          setSwappingIds([]);
        }
      }
      n--;
    } while (swapped && isMounted.current);

    setIsSorting(false);
    setCurrentIndices([]);
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Expose shuffle function via ref
  useImperativeHandle(ref, () => ({
    shuffle: async () => {
      let iterations = currentData.length * 2;
      let currentDataCopy = [...currentData];
      
      for (let i = 0; i < iterations; i++) {
        const index1 = Math.floor(Math.random() * currentDataCopy.length);
        const index2 = Math.floor(Math.random() * currentDataCopy.length);
        
        if (index1 === index2) continue;

        // Perform swap
        [currentDataCopy[index1], currentDataCopy[index2]] = [
          currentDataCopy[index2], 
          currentDataCopy[index1]
        ];
        
        setCurrentData([...currentDataCopy]);
        await new Promise(resolve => setTimeout(resolve, 300 / 7));
      }
    }
  }), [currentData]);

  return (
    <div className="flex flex-col gap-4  bg-gray-50">
      <div className="w-64 h-96 pl-10 pr-3 rounded-lg relative">
        {currentData.map(({ id, value, originalIndex }, index) => {
          const targetY = calculatePosition(index);
          const originY = calculatePosition(originalIndex);

          return (
            <motion.div
              key={id}
              initial={{ y: originY, opacity: 0, width: 0, height: 0 }}
              animate={{
                y: targetY,
                width: `${(value / maxValue) * 100}%`,
                height: barHeight,
                opacity: 1
              }}
              transition={{
                y: { type: 'spring', stiffness: 300, damping: 30 },
                width: { duration: 0.3 },
                height: { duration: 0.3 },
                opacity: { duration: 0.2 }
              }}
              className={`absolute left-6 transition-colors origin-left rounded-r ${
                swappingIds.includes(id) ? 'bg-black' : 
                currentIndices.includes(index) ? 'bg-blue-400' : 'bg-gray-300'
              }`}
            >
              <Chevron visible={swappingIds.includes(id)} />
            </motion.div>
          );
        })}
      </div>
      <button
        onClick={bubbleSort}
        disabled={isSorting}
        className={`px-4 py-2 text-white rounded transition-colors self-center ${
          isSorting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSorting ? 'Sorting...' : 'Start Bubble Sort'}
      </button>
    </div>
  );
});

export default BarAnimator; 