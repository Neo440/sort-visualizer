import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Bar() {
  return (
    <div className="w-[5%] flex flex-col shadow-lg justify-between border-2 border-gray-200 rounded-lg bg-white p-2">
      <div className="flex-none h-16 w-full border-b-2 border-gray-100 flex items-center justify-center">
        <Link 
          href="https://www.bitscollege.edu.et/" 
          aria-label="Visit BITS College website"
          className="relative size-10"
        >
          <Image
            src="/logo-mark.png"
            alt="Bits logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute -rotate-90 transform origin-center whitespace-nowrap text-xl font-bold">
          Sort Vi.
        </div>
      </div>

      <div className="flex-none h-16 w-full border-t-2 border-gray-100 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent"
          asChild
        >
          <Link href="#" aria-label="GitHub repository">
            <Github className="size-7" />
          </Link>
        </Button>
      </div>
    </div>
  );
}