import { memo } from 'react';

interface ChevronProps {
  visible: boolean;
}

const Chevron = memo(({ visible }: ChevronProps) => (
  <svg
    className={`absolute left-0 -translate-x-3/4 -ml-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity duration-300 ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
));

Chevron.displayName = 'Chevron'; // For better debugging in React DevTools

export default Chevron; 