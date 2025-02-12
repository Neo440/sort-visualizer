import { AnimatePresence, motion } from 'framer-motion';

interface SortingLegendProps {
  algorithm: keyof typeof legendConfig;
}

const legendConfig = {
  bubbleSort: [
    { color: 'bg-rose-400', label: 'Comparing Pair' },
    { color: 'bg-emerald-400', label: 'Swapping' }
  ],
  selectionSort: [
    { color: 'bg-indigo-400', label: 'Current Position' },
    { color: 'bg-amber-400', label: 'Minimum' },
    { color: 'bg-rose-400', label: 'Comparing' },
    { color: 'bg-emerald-400', label: 'Swapping' }
  ],
  insertionSort: [
    { color: 'bg-indigo-400', label: 'Current Element' },
    { color: 'bg-rose-400', label: 'Comparison' },
    { color: 'bg-emerald-400', label: 'Shifting' }
  ],
  quickSort: [
    { color: 'bg-indigo-400', label: 'Pivot Element' },
    { color: 'bg-purple-400', label: 'Partition Area' },
    { color: 'bg-rose-400', label: 'Comparison' },
    { color: 'bg-emerald-400', label: 'Swapping' },
    { color: 'bg-amber-400', label: 'Boundary' }
  ]
};

export default function SortingLegend({ algorithm }: SortingLegendProps) {
  return (
    <motion.div
      layout
      className="mb-4 p-3 bg-white border border-gray-200 rounded-lg shadow-xs"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={algorithm}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600"
        >
          {legendConfig[algorithm].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1.5"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 