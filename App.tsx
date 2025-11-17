
import React, { useState } from 'react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import BottomNav from './components/BottomNav';
import GradeAnalysisTab from './components/GradeAnalysisTab';
import PalletCountTab from './components/PalletCountTab';

export type Tab = 'grade' | 'count';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('grade');
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
    const [cameraCallback, setCameraCallback] = useState<(file: File) => void>(() => () => {});

    const openCamera = (callback: (file: File) => void) => {
        setCameraCallback(() => callback);
        setIsCameraOpen(true);
    };

    const handleCapture = (file: File) => {
        cameraCallback(file);
        setIsCameraOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col items-center p-4 pb-28 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/50 to-[#121212]">
            {isCameraOpen && <CameraView onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
            
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                <Header />
                <main className="w-full mt-8 flex flex-col items-center gap-8">
                    {activeTab === 'grade' && <GradeAnalysisTab onTakePhoto={() => openCamera} />}
                    {activeTab === 'count' && <PalletCountTab onTakePhoto={() => openCamera} />}
                </main>
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default App;
