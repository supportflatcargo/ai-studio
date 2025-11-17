
import React from 'react';
import { CountAnalysisResult } from '../types';

interface CountResultCardProps {
  result: CountAnalysisResult;
}

const QuoteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9zM.017 21v-7.391c0-5.704 3.748-9.57 9-10.609l.995 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-9z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const CrossIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);


export const CountResultCard: React.FC<CountResultCardProps> = ({ result }) => {
  const isMatch = result.match;
  const styles = {
    match: { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30', shadow: 'shadow-[0_0_20px_rgba(163,230,53,0.4)]' },
    mismatch: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' },
  }[isMatch ? 'match' : 'mismatch'];

  return (
    <div className={`w-full max-w-lg p-6 rounded-xl border ${styles.bg} ${styles.border} shadow-lg backdrop-blur-sm transition-all duration-500 ease-in-out`}>
      <div className="flex items-center gap-6">
        <div className={`flex-shrink-0 w-24 h-24 rounded-lg border ${styles.border} flex items-center justify-center ${styles.bg} ${styles.shadow}`}>
          {isMatch ? <CheckIcon className={`w-14 h-14 ${styles.text}`} /> : <CrossIcon className={`w-14 h-14 ${styles.text}`} />}
        </div>
        <div className="flex-grow">
          <h3 className={`text-xl font-bold ${styles.text}`}>
            {isMatch ? "Comptage Confirmé" : "Écart de Comptage"}
          </h3>
          <p className="text-gray-200 mt-1">
            Attendu: <span className="font-bold">{result.expected}</span> | Compté: <span className={`font-bold ${styles.text}`}>{result.counted}</span>
          </p>
        </div>
      </div>
      <div className="relative mt-4 pt-4 border-t border-white/10 pl-5 text-gray-300 italic">
          <QuoteIcon className={`absolute left-0 top-5 w-4 h-4 ${styles.text} opacity-30`} />
          <p>{result.reason}</p>
      </div>
    </div>
  );
};
