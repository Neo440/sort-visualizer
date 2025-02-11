import { useState, useEffect, useMemo, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import BarItem from './BarItem';
import { ShuffleType } from '@/components/layout/Sections/ControlBoard';

interface BarData {
  id: string;
  value: number;
}

interface BarAnimatorProps {
  data: number[];
  speed: number;
}

export interface BarAnimatorHandles {
  shuffle: (type: ShuffleType) => Promise<void>;
  bubbleSort: () => Promise<void>;
  abort: () => void;
  getCurrentData: () => number[];
}

interface Transition {
  index: number;
  newIndex: number;
  value: number;
  targetY: number;
}

const areArraysEqual = (a: number[], b: number[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const BarAnimator = forwardRef<BarAnimatorHandles, BarAnimatorProps>(({ data, speed }: BarAnimatorProps, ref) => {
  const [currentData, setCurrentData] = useState<BarData[]>(() =>
    data.map((value, index) => ({
      id: `bar-${index}-${value}`,
      value,
    }))
  );

  const [swappingIds, setSwappingIds] = useState<string[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const isMounted = useRef(true);
  const currentDataRef = useRef(currentData);
  const prevDataRef = useRef<BarData[]>([]);

  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);

  useEffect(() => {
    if (areArraysEqual(data, currentDataRef.current.map(d => d.value))) return;
    
    setCurrentData(prev => {
      const existingMap = new Map(prev.map(bar => [bar.id, bar]));
      return data.map((value, index) => 
        existingMap.get(`bar-${index}-${value}`) || {
          id: `bar-${index}-${value}`,
          value,
        }
      );
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

  const bubbleSort = useCallback(async () => {
    isMounted.current = true;
    console.log('BubbleSort implementation called');
    try {
      const currentSpeed = speed;
      setIsSorting(true);
      let dataCopy = [...currentData];
      let n = dataCopy.length;
      let swapped: boolean;

      do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
          if (!isMounted.current) return;
          
          // Store previous positions before swap
          prevDataRef.current = [...dataCopy];
          
          setCurrentIndices([i, i + 1]);
          await new Promise(resolve => setTimeout(resolve, 500 / currentSpeed));

          if (dataCopy[i].value > dataCopy[i + 1].value) {
            setSwappingIds([dataCopy[i].id, dataCopy[i + 1].id]);
            
            // Perform swap
            [dataCopy[i], dataCopy[i + 1]] = [dataCopy[i + 1], dataCopy[i]];
            swapped = true;

            // Update state and wait for animation
            setCurrentData([...dataCopy]);
            await new Promise(resolve => setTimeout(resolve, 1000 / currentSpeed));
            
            setSwappingIds([]);
          }
        }
        n--;
      } while (swapped && isMounted.current);
    } finally {
      if (isMounted.current) {
        setIsSorting(false);
        setCurrentIndices([]);
      }
    }
  }, [speed, currentData]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Optimized shuffle function
  useImperativeHandle(ref, () => ({
    shuffle: async (type: ShuffleType) => {
      const newValues = generateShuffledArray(currentDataRef.current.length, type);
      await animateShuffleTransition(newValues);
    },
    bubbleSort,
    abort: () => {
      isMounted.current = false;
      setCurrentIndices([]);
      setSwappingIds([]);
    },
    getCurrentData: () => currentDataRef.current.map(d => d.value)
  }), [bubbleSort]);

  // Add reduced motion support
  const shouldReduceMotion = useReducedMotion();

  const generateShuffledArray = (length: number, type: ShuffleType): number[] => {
    // Implement the same logic as in index.tsx's generateShuffledArray
    switch (type) {
      case 'random':
        return Array.from({ length }, (_, i) => i + 1)
          .sort(() => Math.random() - 0.5);
      case 'reversed':
        return Array.from({ length }, (_, i) => i + 1).reverse();
      case 'nearly-sorted':
        const arr = Array.from({ length }, (_, i) => i + 1);
        for (let i = 0; i < 3; i++) {
          const index = Math.floor(Math.random() * (length - 1));
          [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        }
        return arr;
      case 'few-unique':
        const uniqueValues = [1, 2, 3, 4];
        return Array.from({ length }, () => 
          uniqueValues[Math.floor(Math.random() * uniqueValues.length)]
        );
      default:
        return Array.from({ length }, (_, i) => i + 1);
    }
  };

  const calculateTransitions = (current: number[], next: number[]): Transition[] => {
    const transitions: Transition[] = [];
    const tempArray = [...current];
    
    // Create a map of value positions in the new array
    const valuePositions = new Map<number, number[]>();
    next.forEach((value, index) => {
      if (!valuePositions.has(value)) {
        valuePositions.set(value, []);
      }
      valuePositions.get(value)?.push(index);
    });

    // Calculate moves needed to reach target state
    for (let i = 0; i < next.length; i++) {
      const targetValue = next[i];
      const sourceIndex = tempArray.findIndex((val, idx) => 
        val === targetValue && !transitions.some(t => t.index === idx)
      );

      if (sourceIndex !== -1 && sourceIndex !== i) {
        transitions.push({
          index: sourceIndex,
          newIndex: i,
          value: targetValue,
          targetY: calculatePosition(i)
        });
        
        // Swap in temp array to track moved elements
        [tempArray[sourceIndex], tempArray[i]] = [tempArray[i], tempArray[sourceIndex]];
      }
    }

    return transitions;
  };

  const animateShuffleTransition = async (newValues: number[]) => {
    const currentValues = currentDataRef.current.map(d => d.value);
    if (areArraysEqual(currentValues, newValues)) return;

    const transitions = calculateTransitions(currentValues, newValues);
    
    // Animate each transition step
    for (const transition of transitions as Transition[]) {
      if (!isMounted.current) break;
      
      setCurrentData(prev => {
        const newData = [...prev];
        // Swap elements
        [newData[transition.index], newData[transition.newIndex]] = 
          [newData[transition.newIndex], newData[transition.index]];
        return newData;
      });

      await new Promise(resolve => setTimeout(resolve, 1000 / speed));
    }

    // Final alignment
    setCurrentData(newValues.map((value, index) => ({
      id: `bar-${index}-${value}`,
      value
    })));
  };

  return (
    <div className=" w-full relative">
        {currentData.map(({ id, value }, index) => {
          const previousIndex = prevDataRef.current.findIndex(bar => bar.id === id);
          const originY = previousIndex >= 0 ? calculatePosition(previousIndex) : calculatePosition(index);
          
          return (
            <BarItem
              key={id}
              id={id}
              value={value}
              maxValue={maxValue}
              originY={originY}
              targetY={calculatePosition(index)}
              barHeight={barHeight}
              isSwapping={swappingIds.includes(id)}
              isComparing={currentIndices.includes(index)}
              shouldReduceMotion={shouldReduceMotion ?? false}
            />
          );
        })}
    </div>
  );
});

export default BarAnimator; 