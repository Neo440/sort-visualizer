import { useState, useRef, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BarAnimator from '@/components/common/BarAnimator';

export default function Home() {
  const [numElements, setNumElements] = useState(12);
  const [speed, setSpeed] = useState(5);
  const barAnimatorRef = useRef<{ shuffle: () => Promise<void> }>(null);
  
  const sampleData = useMemo(() => 
    Array.from({ length: numElements }, (_, i) => i + 1)
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value),
    [numElements]
  );

  const handleShuffle = async () => {
    if (barAnimatorRef.current) {
      await barAnimatorRef.current.shuffle();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bubble Sort Visualizer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Array Size: {numElements}
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={numElements}
                  onChange={(e) => setNumElements(Number(e.target.value))}
                  className="w-full range-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed: {speed}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full range-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className="flex gap-3 w-full">
              <button
                onClick={handleShuffle}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Shuffle Array
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <BarAnimator
            ref={barAnimatorRef}
            data={sampleData}
            speed={speed}
          />
        </div>

        <p className="mt-6 text-gray-600 text-center text-sm">
          Visualizing bubble sort algorithm - Watch elements bubble up to their correct positions!
        </p>
      </div>
    </DashboardLayout>
  );
}
