import React from 'react';
import { AnalysisResult, PalletGrade } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const gradeStyles: Record<PalletGrade, { bg: string, text: string, border: string, shadow: string }> = {
  [PalletGrade.A]: { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30', shadow: 'shadow-[0_0_20px_rgba(163,230,53,0.4)]' },
  [PalletGrade.B]: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]' },
  [PalletGrade.C]: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]' },
  [PalletGrade.HS]: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' },
  [PalletGrade.UNKNOWN]: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', shadow: 'shadow-[0_0_20px_rgba(156,163,175,0.4)]' },
};

const QuoteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9zM.017 21v-7.391c0-5.704 3.748-9.57 9-10.609l.995 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-9z" />
    </svg>
);


export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const styles = gradeStyles[result.grade] || gradeStyles[PalletGrade.UNKNOWN];

  return (
    <div className={`w-full max-w-lg p-6 rounded-xl border ${styles.bg} ${styles.border} shadow-lg backdrop-blur-sm transition-all duration-500 ease-in-out`}>
      <div className="flex items-center gap-6">
        <div className={`flex-shrink-0 w-24 h-24 rounded-lg border ${styles.border} flex items-center justify-center ${styles.bg} ${styles.shadow}`}>
          <span className={`font-black text-6xl ${styles.text}`}>{result.grade}</span>
        </div>
        <div className="flex-grow">
          <h3 className={`text-xl font-bold ${styles.text}`}>
            Résultat : Grade {result.grade}
          </h3>
          <div className="relative mt-2 pl-5 text-gray-300 italic">
              <QuoteIcon className={`absolute left-0 top-1 w-4 h-4 ${styles.text} opacity-30`} />
              <p>{result.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
};