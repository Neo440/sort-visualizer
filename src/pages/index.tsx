import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BarAnimator, {
  BarAnimatorHandles,
} from "@/components/common/BarAnimator";
import { generateShuffledArray } from '@/lib/arrayUtils';

type ShuffleType = "random" | "reversed" | "nearly-sorted" | "few-unique";

export default function Home() {
  const [numElements, setNumElements] = useState(20);
  const [speed, setSpeed] = useState(5);
  const barAnimatorRef = useRef<BarAnimatorHandles>(null);
  const [status, setStatus] = useState<
    "idle" | "sorting" | "aborted" | "sorted"
  >("idle");
  const [sampleData, setSampleData] = useState<number[]>(() => 
    generateShuffledArray(numElements, 'random')
  );
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    'bubbleSort' | 'selectionSort' | 'insertionSort' | 'quickSort'
  >('bubbleSort');

  useEffect(() => {
    setSampleData(generateShuffledArray(numElements, 'random'));
  }, [numElements]);

  const handleShuffle = async (type: ShuffleType) => {
    if (barAnimatorRef.current) {
      await barAnimatorRef.current.shuffle(type);
      // Get the final state from animator after shuffle completes
      const finalData = await barAnimatorRef.current.getCurrentData();
      setSampleData(finalData);
    }
  };

  const handleSort = async () => {
    setStatus("sorting");
    try {
      if (barAnimatorRef.current) {
        // Reset abort state before starting new sort
        barAnimatorRef.current.abort(); 
        
        // Store reference to current sort promise
        const sortPromise = barAnimatorRef.current[selectedAlgorithm]();
        await sortPromise;
        
        // Only update if sort completed successfully
        const finalData = barAnimatorRef.current.getCurrentData();
        setSampleData(finalData);
        setStatus("sorted");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (error) {
      if (error.message === 'Sorting aborted') {
        setStatus("aborted");
        // Restore original data state after abort
        const currentData = barAnimatorRef.current?.getCurrentData() || sampleData;
        setSampleData([...currentData]);
      }
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const handleAbort = () => {
    if (barAnimatorRef.current) {
      barAnimatorRef.current.abort();
      // Keep status as 'sorting' until abort completes
      const currentData = barAnimatorRef.current.getCurrentData();
      setSampleData([...currentData]);
      // Let the natural state transition handle the status change
    }
  };

  const sortingAlgorithmsCode = {
    bubbleSort: `function bubbleSort(arr) {
      let swapped;
      do {
        swapped = false;
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            swapped = true;
          }
        }
      } while (swapped);
      return arr;
    }`,
    
    selectionSort: `function selectionSort(arr) {
      for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[j] < arr[min]) min = j;
        }
        if (min !== i) [arr[i], arr[min]] = [arr[min], arr[i]];
      }
      return arr;
    }`,
    
    insertionSort: `function insertionSort(arr) {
      for (let i = 1; i < arr.length; i++) {
        let current = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > current) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = current;
      }
      return arr;
    }`,
    quickSort: `function quickSort(arr, low = 0, high = arr.length - 1) {
      if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
      }
      return arr;
    }

    function partition(arr, low, high) {
      const pivot = arr[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
      return i + 1;
    }`
  };

  return (
    <DashboardLayout
      controlProps={{
        numElements,
        speed,
        status,
        onNumElementsChange: setNumElements,
        onSpeedChange: setSpeed,
        onShuffle: handleShuffle,
        onSort: handleSort,
        onAbort: handleAbort,
        codeSnippets: sortingAlgorithmsCode,
        currentStep: 0,
        selectedAlgorithm,
        onAlgorithmChange: setSelectedAlgorithm
      }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="w-full p-4">
          <BarAnimator 
            ref={barAnimatorRef} 
            data={sampleData} 
            speed={speed}
            selectedAlgorithm={selectedAlgorithm} 
          />
        </div>
        
      </div>
    </DashboardLayout>
  );
}
