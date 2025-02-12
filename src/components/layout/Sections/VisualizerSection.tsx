import { ReactNode } from 'react';
import SortingLegend from '@/components/common/SortingLegend';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Add this configuration object at the top of the file
const algorithmInfo = {
  bubbleSort: {
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    properties: ['Stable', 'In-place', 'Adaptive'],
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
  },
  selectionSort: {
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    properties: ['Unstable', 'In-place', 'Non-adaptive'],
    description: 'Repeatedly finds the minimum element from unsorted part and puts it at the beginning.'
  },
  quickSort: {
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    properties: ['Unstable', 'In-place', 'Divide & Conquer'],
    description: 'Picks a pivot element and partitions the array around the pivot using recursion.'
  }
};

interface VisualizerSectionProps {
  children: ReactNode;
  selectedAlgorithm: keyof typeof algorithmInfo;
}

export default function VisualizerSection({ children, selectedAlgorithm }: VisualizerSectionProps) {
  return (
    <div className="w-[45%] border-2 border-gray-200 shadow-lg rounded-xl bg-white p-4 flex flex-col">
      <SortingLegend algorithm={selectedAlgorithm} />
      
      <div className="flex-1 min-h-0">
        {children}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAlgorithm}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold capitalize">
                  {selectedAlgorithm.replace('Sort', '')} Sort
                </h3>
                <div className="flex flex-wrap gap-1.5 max-w-[60%] justify-end">
                  {algorithmInfo[selectedAlgorithm].properties.map((prop) => (
                    <span 
                      key={prop}
                      className="px-2 py-1 text-[0.7rem] font-medium bg-white border border-gray-200 rounded-md"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs font-medium mb-1">Time Complexity</p>
                  <div className="flex gap-4">
                    <div className="space-y-0.5">
                      <p className="text-xs">Best: {algorithmInfo[selectedAlgorithm].timeComplexity.best}</p>
                      <p className="text-xs">Worst: {algorithmInfo[selectedAlgorithm].timeComplexity.worst}</p>
                    </div>
                    <div className="h-full w-px bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Average</p>
                      <p className="text-xs">{algorithmInfo[selectedAlgorithm].timeComplexity.average}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-gray-500 text-xs font-medium mb-1">Space Complexity</p>
                  <p className="text-xs">{algorithmInfo[selectedAlgorithm].spaceComplexity}</p>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-600 leading-snug">
                {algorithmInfo[selectedAlgorithm].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 