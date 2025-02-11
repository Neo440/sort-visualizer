import { useState, useEffect, useMemo, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import BarItem from './BarItem';
import { ShuffleType } from '@/components/layout/Sections/ControlBoard';
import { generateShuffledArray } from '@/lib/arrayUtils';

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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);

  useEffect(() => {
    if (isAnimating) return;
    if (areArraysEqual(data, currentDataRef.current.map(d => d.value))) return;
    
    setCurrentData(prev => {
      const newData = data.map((value, index) => ({
        id: `bar-${crypto.randomUUID()}`,
        value,
      }));
      prevDataRef.current = newData;
      return newData;
    });
  }, [data, isAnimating]);

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
    setIsAnimating(true);
    try {
      isMounted.current = true;
      console.log('BubbleSort implementation called');
      const currentSpeed = speed;
      setIsSorting(true);
      let dataCopy = [...currentData];
      let n = dataCopy.length;
      let swapped: boolean;

      do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
          if (!isMounted.current) {
            throw new Error('Sorting aborted');
          }
          
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

      // Only mark as sorted if completed naturally
      if (isMounted.current) {
        setCurrentData([...dataCopy]);
      }
    } finally {
      if (isMounted.current) {
        setIsSorting(false);
        setCurrentIndices([]);
      }
      setIsAnimating(false);
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
      setIsAnimating(true);
      try {
        // Always generate fresh array for non-few-unique initializers
        const newValues = type === 'few-unique' 
          ? generateShuffledArray(currentDataRef.current.length, type)
          : generateShuffledArray(currentDataRef.current.length, type);

        // Force full reset for initializers that require unique values
        if (['random', 'reversed', 'nearly-sorted'].includes(type)) {
          setCurrentData(newValues.map((value, index) => ({
            id: `bar-${crypto.randomUUID()}`,
            value
          })));
          return;
        }

        // Existing few-unique handling
        if (type === 'few-unique') {
          setCurrentData(newValues.map((value) => ({
            id: `bar-${crypto.randomUUID()}`,
            value
          })));
          return;
        }

        await animateShuffleTransition(newValues);
      } finally {
        setIsAnimating(false);
      }
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

  const calculateTransitions = (current: number[], next: number[]): Transition[] => {
    const transitions: Transition[] = [];
    const tempArray = [...current];
    const isReversed = next[0] === current[current.length - 1];

    // Handle reversed case with direct position mapping
    if (isReversed) {
      for (let i = 0; i < Math.floor(next.length / 2); i++) {
        const targetIndex = next.length - 1 - i;
        transitions.push({
          index: i,
          newIndex: targetIndex,
          value: next[i],
          targetY: calculatePosition(targetIndex)
        });
        transitions.push({
          index: targetIndex,
          newIndex: i,
          value: next[targetIndex],
          targetY: calculatePosition(i)
        });
      }
      return transitions;
    }

    // Existing logic for other shuffle types
    const valuePositions = new Map<number, number[]>();
    next.forEach((value, index) => {
      if (!valuePositions.has(value)) {
        valuePositions.set(value, []);
      }
      valuePositions.get(value)?.push(index);
    });

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
        
        [tempArray[sourceIndex], tempArray[i]] = [tempArray[i], tempArray[sourceIndex]];
      }
    }

    return transitions;
  };

  const animateShuffleTransition = async (newValues: number[]) => {
    const currentValues = currentDataRef.current.map(d => d.value);
    
    // Direct replacement for few-unique case
    if (!currentValues.some(v => newValues.includes(v))) {
      setCurrentData(newValues.map((value, index) => ({
        id: `bar-${crypto.randomUUID()}`,
        value
      })));
      return;
    }

    // Existing transition logic for other cases
    const transitions = calculateTransitions(currentValues, newValues);
    
    // Process transitions in reverse order for reversal
    if (newValues[0] === currentValues[currentValues.length - 1]) {
      transitions.reverse();
    }

    for (const transition of transitions) {
      if (!isMounted.current) break;
      
      setCurrentData(prev => {
        const newData = [...prev];
        // Swap elements directly between original and target positions
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