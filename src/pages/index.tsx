import { useState, useRef, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BarAnimator, {
  BarAnimatorHandles,
} from "@/components/common/BarAnimator";
import { generateShuffledArray } from '@/lib/arrayUtils';

type ShuffleType = "random" | "reversed" | "nearly-sorted" | "few-unique";

export default function Home() {
  const [numElements, setNumElements] = useState(12);
  const [speed, setSpeed] = useState(5);
  const barAnimatorRef = useRef<BarAnimatorHandles>(null);
  const [status, setStatus] = useState<
    "idle" | "sorting" | "aborted" | "sorted"
  >("idle");
  const [sampleData, setSampleData] = useState<number[]>(() => 
    generateShuffledArray(numElements, 'random')
  );

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
        await barAnimatorRef.current.bubbleSort();
        setStatus("sorted");
      }
    } catch (error) {
      setStatus("aborted");
    }
  };

  const handleAbort = () => {
    if (barAnimatorRef.current) {
      barAnimatorRef.current.abort();
      setStatus("aborted");
    }
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
      }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="w-full p-4">
          <BarAnimator ref={barAnimatorRef} data={sampleData} speed={speed} />
        </div>
        <div className="w-full h-[50%] border-1 shadow-md p-4 rounded-md flex flex-col gap-4">
          <span className="font-bold">Properties</span>
          <ul className="class">
            <li>Time-Complexity</li>
            <li>Space-Complexity</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
