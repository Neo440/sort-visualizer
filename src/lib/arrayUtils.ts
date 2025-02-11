import { ShuffleType } from '@/components/layout/Sections/ControlBoard';

export const generateShuffledArray = (length: number, type: ShuffleType): number[] => {
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
      return Array.from({ length }, (_, i) => 
        uniqueValues[Math.floor(i / 2) % uniqueValues.length]
      ).sort(() => Math.random() - 0.5);
    default:
      return Array.from({ length }, (_, i) => i + 1);
  }
}; 