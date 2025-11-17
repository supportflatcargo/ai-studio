import React from 'react';

const PalletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20 2H4c-1.1 0-2 .9-2 2v16h20V4c0-1.1-.9-2-2-2zM8 18H4v-4h4v4zm6 0h-4v-4h4v4zm6 0h-4v-4h4v4zM8 12H4V8h4v4zm6 0h-4V8h4v4zm6 0h-4V8h4v4z"/>
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="text-center p-4 md:p-6">
            <div className="inline-flex items-center justify-center bg-lime-500 text-black p-3 rounded-xl mb-4">
                <PalletIcon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-50">
                Palette Quality Check
            </h1>
            <p className="mt-2 text-lg text-gray-400">
                Utilisez l'IA pour une évaluation instantanée du grade de vos palettes.
            </p>
        </header>
    );
};

export default Header;