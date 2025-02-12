import { parseCode } from '@/lib/codeParser';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CodeSectionProps {
  codeSnippets: {
    bubbleSort: string;
    selectionSort: string;
    insertionSort: string;
  };
  currentLine?: number;
  selectedAlgorithm: keyof CodeSectionProps['codeSnippets'];
  onAlgorithmChange: (algorithm: keyof CodeSectionProps['codeSnippets']) => void;
}

export default function CodeSection({ codeSnippets, currentLine, selectedAlgorithm, onAlgorithmChange }: CodeSectionProps) {
  const parsedCode = parseCode(codeSnippets[selectedAlgorithm]);

  return (
    <div className='w-full border-2 border-gray-200 shadow-lg rounded-xl h-full flex flex-col p-3 bg-white overflow-hidden'>
      <div className="h-7 w-full flex gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-400"/>
                <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                <div className="w-3 h-3 rounded-full bg-green-400"/>
            </div>
      
      <Tabs 
        value={selectedAlgorithm as string}
        onValueChange={(value) => onAlgorithmChange(value as keyof CodeSectionProps['codeSnippets'])}
      >
        <TabsList className="bg-gray-100 p-1.5 h-auto mb-4">
          <TabsTrigger 
            value="bubbleSort" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 py-1.5 text-sm"
          >
            Bubble Sort
          </TabsTrigger>
          <TabsTrigger 
            value="selectionSort" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 py-1.5 text-sm"
          >
            Selection Sort
          </TabsTrigger>
          <TabsTrigger 
            value="insertionSort" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 py-1.5 text-sm"
          >
            Insertion Sort
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode='wait'>
          <motion.div
            key={selectedAlgorithm}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <TabsContent value={selectedAlgorithm}>
              <div className="w-full h-full rounded-md bg-[var(--code-bg)] p-4 font-mono text-sm overflow-y-auto relative">
                <div className="absolute inset-0 pointer-events-none border border-gray-200/30 rounded-md" />
                {parsedCode.map((line, i) => (
                  <motion.div
                    key={`${selectedAlgorithm}-line-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'flex gap-4 px-2 py-1 rounded',
                      currentLine === i + 1 ? 'bg-blue-50/50 border-l-4 border-blue-400' : ''
                    )}
                  >
                    <div className="text-gray-400 select-none w-8">{i + 1}</div>
                    <div className="flex-1 flex">
                      {line.map((token, j) => (
                        <span
                          key={j}
                          className={cn('whitespace-pre', {
                            'text-blue-600': token.type === 'keyword',
                            'text-green-600': token.type === 'function',
                            'text-gray-400': token.type === 'comment',
                            'text-orange-600': token.type === 'string',
                            'text-purple-600': token.type === 'number',
                            'text-red-500': token.type === 'operator',
                            'text-gray-800': token.type === 'variable',
                            'inline-block': token.type === 'whitespace',
                          })}
                        >
                          {token.type === 'whitespace' ? '\u00A0'.repeat(token.value.length) : token.value}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}