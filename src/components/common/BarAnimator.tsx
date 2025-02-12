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
  selectedAlgorithm: 'bubbleSort' | 'selectionSort' | 'insertionSort' | 'quickSort';
}

export interface BarAnimatorHandles {
  shuffle: (type: ShuffleType) => Promise<void>;
  bubbleSort: () => Promise<void>;
  selectionSort: () => Promise<void>;
  quickSort: () => Promise<void>;
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

const BarAnimator = forwardRef<BarAnimatorHandles, BarAnimatorProps>(({ 
  data, 
  speed,
  selectedAlgorithm
}: BarAnimatorProps, ref) => {
  const [currentData, setCurrentData] = useState<BarData[]>(() =>
    data.map((value, index) => ({
      id: `bar-${index}-${value}`,
      value,
    }))
  );

  const [swappingIds, setSwappingIds] = useState<string[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [partitionBoundaries, setPartitionBoundaries] = useState<number[]>([]);
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
          
          // Add additional abort check before each comparison
          if (!isMounted.current) break;
          
          // Set both indices as compared pair
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
      isMounted.current = true;  // Reset mount state for next sort
    }
  }, [speed, currentData]);

  const selectionSort = useCallback(async () => {
    setIsAnimating(true);
    try {
      isMounted.current = true;
      const currentSpeed = speed;
      setIsSorting(true);
      let dataCopy = [...currentData];
      const n = dataCopy.length;

      for (let i = 0; i < n - 1; i++) {
        if (!isMounted.current) throw new Error('Sorting aborted');
        
        let minIndex = i;
        // Highlight initial position and minimum candidate
        setCurrentIndices([i, minIndex]);
        await new Promise(resolve => setTimeout(resolve, 500 / currentSpeed));

        for (let j = i + 1; j < n; j++) {
          if (!isMounted.current) {
            throw new Error('Sorting aborted');
          }
          
          // Highlight comparison indices and current minimum
          setCurrentIndices([i, j, minIndex]);
          await new Promise(resolve => setTimeout(resolve, 500 / currentSpeed));

          if (dataCopy[j].value < dataCopy[minIndex].value) {
            minIndex = j;
            // Visual feedback for new minimum
            setCurrentIndices([i, j, minIndex]);
            await new Promise(resolve => setTimeout(resolve, 300 / currentSpeed));
          }
        }

        if (!isMounted.current) break; // Final abort check before swap

        if (minIndex !== i) {
          // Highlight swap targets
          setSwappingIds([dataCopy[i].id, dataCopy[minIndex].id]);
          setCurrentIndices([i, minIndex]);
          
          // Pre-swap delay
          await new Promise(resolve => setTimeout(resolve, 700 / currentSpeed));
          
          // Perform swap
          [dataCopy[i], dataCopy[minIndex]] = [dataCopy[minIndex], dataCopy[i]];
          setCurrentData([...dataCopy]);
          
          // Post-swap delay
          await new Promise(resolve => setTimeout(resolve, 1200 / currentSpeed));
          
          // Clear highlights
          setSwappingIds([]);
          setCurrentIndices([]);
        }
      }

      if (isMounted.current) {
        setCurrentData([...dataCopy]);
        setCurrentIndices(Array.from({length: n}, (_, i) => i)); // Highlight all when sorted
      }
    } finally {
      if (isMounted.current) {
        setIsSorting(false);
        setCurrentIndices([]);
      }
      setIsAnimating(false);
    }
  }, [speed, currentData]);

  const quickSort = useCallback(async () => {
    setIsAnimating(true);
    try {
      isMounted.current = true;
      const currentSpeed = speed;
      setIsSorting(true);
      let dataCopy = [...currentData];
      const stack: [number, number][] = [[0, dataCopy.length - 1]];
      setCurrentIndices([]);
      setPartitionBoundaries([]);

      // Add initial abort check
      if (!isMounted.current) return;
      
      while (stack.length > 0 && isMounted.current) {
        const [low, high] = stack.pop()!;
        // Add abort check before processing partition
        if (!isMounted.current) break;
        setPartitionBoundaries([low, high]);
        
        // Handle small partitions with simple sort
        if (high - low + 1 < 4) {
          await bubbleSortPartition(dataCopy, low, high, currentSpeed);
          continue;
        }

        // Select pivot and visualize selection
        const pivotValue = dataCopy[high].value;
        setCurrentIndices([high]);
        await new Promise(resolve => setTimeout(resolve, 800 / currentSpeed));

        let i = low - 1;
        setPartitionBoundaries([low, high]);
        
        for (let j = low; j < high; j++) {
          if (!isMounted.current) {
            throw new Error('Sorting aborted');
          }
          
          // Visualize comparison and partition progress
          setCurrentIndices([j, high, i >= low ? i : -1]);
          await new Promise(resolve => setTimeout(resolve, 400 / currentSpeed));

          if (dataCopy[j].value <= pivotValue) {
            i++;
            
            if (i !== j) {
              setSwappingIds([dataCopy[i].id, dataCopy[j].id]);
              [dataCopy[i], dataCopy[j]] = [dataCopy[j], dataCopy[i]];
              setCurrentData([...dataCopy]);
              await new Promise(resolve => setTimeout(resolve, 1000 / currentSpeed));
              setSwappingIds([]);
            }
            
            // Visualize partition growth
            setCurrentIndices([...currentIndices, i]);
          }
        }

        // Animate final pivot placement
        const pivotIndex = i + 1;
        setSwappingIds([dataCopy[pivotIndex].id, dataCopy[high].id]);
        [dataCopy[pivotIndex], dataCopy[high]] = [dataCopy[high], dataCopy[pivotIndex]];
        setCurrentData([...dataCopy]);
        
        // Extra emphasis for pivot placement
        await new Promise(resolve => setTimeout(resolve, 1200 / currentSpeed));
        setCurrentIndices([pivotIndex]);
        await new Promise(resolve => setTimeout(resolve, 600 / currentSpeed));
        setSwappingIds([]);

        // Queue partitions with visual delay
        await new Promise(resolve => setTimeout(resolve, 300 / currentSpeed));
        stack.push([pivotIndex + 1, high]);
        stack.push([low, pivotIndex - 1]);
      }

      if (isMounted.current) {
        setCurrentIndices(Array.from({length: dataCopy.length}, (_, i) => i));
      }
    } finally {
      if (isMounted.current) {
        setIsSorting(false);
        setCurrentIndices([]);
        setPartitionBoundaries([]);
      }
      setIsAnimating(false);
    }
  }, [speed, currentData]);

  // Helper for small partition sorting
  const bubbleSortPartition = async (arr: BarData[], low: number, high: number, speed: number) => {
    for (let i = low; i <= high; i++) {
      for (let j = low; j < high - (i - low); j++) {
        setCurrentIndices([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, 500 / speed));

        if (arr[j].value > arr[j + 1].value) {
          setSwappingIds([arr[j].id, arr[j + 1].id]);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setCurrentData([...arr]);
          await new Promise(resolve => setTimeout(resolve, 800 / speed));
          setSwappingIds([]);
        }
      }
    }
  };

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
    selectionSort,
    quickSort,
    abort: () => {
      isMounted.current = false;
      setIsAnimating(false);  // Add this to immediately stop animations
      setCurrentIndices([]);
      setSwappingIds([]);
      setPartitionBoundaries([]);  // Clear quick sort boundaries
    },
    getCurrentData: () => currentDataRef.current.map(d => d.value)
  }), [bubbleSort, selectionSort, quickSort]);

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
          const isCurrent = currentIndices[0] === index;
          const isComparing = currentIndices[1] === index;
          const isMin = currentIndices[2] === index;

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
              isCurrent={isCurrent}
              isComparing={isComparing}
              isMin={isMin}
              shouldReduceMotion={shouldReduceMotion ?? false}
              currentIndices={currentIndices}
              index={index}
              algorithm={selectedAlgorithm}
              partitionBoundaries={partitionBoundaries}
            />
          );
        })}
    </div>
  );
});

export default BarAnimator; 