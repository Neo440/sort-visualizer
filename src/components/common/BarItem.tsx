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
  isSwapping: boolean;
  isComparing: boolean;
  shouldReduceMotion: boolean;
}

const BarItem = memo(({ 
  value,
  maxValue,
  originY,
  targetY,
  barHeight,
  isSwapping,
  isComparing,
  shouldReduceMotion
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
      isSwapping ? 'bg-green-400' :
      isComparing ? 'bg-black' : 'bg-gray-200' 
    }`}
  >
    <Chevron visible={isSwapping} />
  </motion.div>
));

export default BarItem; 