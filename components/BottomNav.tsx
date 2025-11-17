
import React from 'react';
import { Tab } from '../App';

interface BottomNavProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const GradeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.32 1.011l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .32-1.011l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
);

const CountIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.254 9.254 9 9.563 9h4.874c.309 0 .563.254.563.563v4.874c0 .309-.254.563-.563.563H9.563A.562.562 0 0 1 9 14.437V9.564Z" />
    </svg>
);

const NavButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-200 ease-in-out ${isActive ? 'text-lime-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
            {icon}
            <span className={`mt-1 text-xs font-bold ${isActive ? 'text-lime-400' : 'text-gray-500'}`}>{label}</span>
            {isActive && <div className="w-10 h-1 bg-lime-400 rounded-full mt-1"></div>}
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 shadow-lg z-40">
            <div className="max-w-4xl mx-auto h-full flex justify-around items-center">
                <NavButton
                    label="Analyse Grade"
                    icon={<GradeIcon className="w-7 h-7" />}
                    isActive={activeTab === 'grade'}
                    onClick={() => setActiveTab('grade')}
                />
                <NavButton
                    label="Comptage Palettes"
                    icon={<CountIcon className="w-7 h-7" />}
                    isActive={activeTab === 'count'}
                    onClick={() => setActiveTab('count')}
                />
            </div>
        </nav>
    );
};

export default BottomNav;
