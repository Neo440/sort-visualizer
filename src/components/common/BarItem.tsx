import { memo } from 'react';
import { motion } from 'framer-motion';
import Chevron from './Chevron';

interface BarItemProps {
  id: string;
  value: number;
  maxValue: number;
  originY: number;
  targetY: number;
  barHeight: number;
  isSwapping?: boolean;
  isCurrent?: boolean;
  isComparing?: boolean;
  isMin?: boolean;
  shouldReduceMotion: boolean;
  currentIndices: number[];
  index: number;
  algorithm: 'bubbleSort' | 'selectionSort' | 'insertionSort' | 'quickSort';
  partitionBoundaries: number[];
}

const BarItem = memo(({ 
  value,
  maxValue = 1,
  originY = 0,
  targetY = 0,
  barHeight = 40,
  isSwapping,
  isCurrent,
  isComparing,
  isMin,
  shouldReduceMotion,
  currentIndices,
  index,
  algorithm,
  partitionBoundaries
}: BarItemProps) => (
  <motion.div
    initial={{ y: originY, opacity: 0, width: 0, height: 0 }}
    animate={{
      y: targetY,
      width: `${(value / maxValue) * 100}%`,
      height: barHeight,
      opacity: 1
    }}
    transition={{
      y: shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 },
      width: { duration: shouldReduceMotion ? 0 : 0.3 },
      height: { duration: shouldReduceMotion ? 0 : 0.3 },
      opacity: { duration: 0.2 }
    }}
    className={`absolute flex justify-center transition-colors origin-left rounded-r ${
      isSwapping ? 'bg-emerald-400' :
      algorithm === 'quickSort' 
        ? (isCurrent ? 'bg-indigo-400' : 
           partitionBoundaries[0] <= index && index <= partitionBoundaries[1] ? 'bg-gray-800' :
           isComparing ? 'bg-rose-400' : 
           currentIndices.includes(index) ? 'bg-amber-400' : 'bg-gray-900/20')
        : algorithm === 'selectionSort' 
          ? (isCurrent ? 'bg-indigo-400' : 
             isMin ? 'bg-amber-400' : 
             isComparing ? 'bg-rose-400' : 'bg-gray-200')
          : (currentIndices.includes(index) ? 'bg-rose-400' : 'bg-gray-200')
    } ${
      algorithm === 'quickSort' && 
      partitionBoundaries?.length === 2 &&
      (index < partitionBoundaries[0] || index > partitionBoundaries[1]) 
        ? 'opacity-50 transition-opacity duration-300' 
        : ''
    }`}
  >
    <Chevron visible={isSwapping} />
  </motion.div>
));

export default BarItem;